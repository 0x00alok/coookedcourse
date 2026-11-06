import prisma from '../prisma-client/getPrismaClient';

import { VideoDataExtractor } from './VideoDataExtractor';
import { AnalyzedTopicsMapper } from './AnalyzedTopicsMapper';
import { checkInCacheThenCall } from '../redis-client/checkExistsInCache';
import { PlaylistFetcher } from './PlaylistFetcher';
import { topicComparison } from '../../services/llm/agentService';

import { CK_CHANNELS_STAT_MAP, CK_CHANNELS_WITH_VIDEOS_TITLES, CK_COOKED_PLAYLIST_LIST } from '../../constants/constants';
import { AnalyzedSyllabus, ChannelWithAnalysis, ChannelWithTopics, ExtractedVideoDataWithChannelDetail, PlaylistGenerationTopic, VideoIdToStats, YouTubePlaylistsResponse, YouTubeVideoApiResponse } from '../../types/cookedcourse';

export class CuratePlaylist {
	private topics: PlaylistGenerationTopic[];
	private subject: string;
	private MAX_PLAYLISTS_TO_FETCH: string;
	public token: string;
	private pf: PlaylistFetcher;

	constructor(topics: PlaylistGenerationTopic[], subject: string, token: string) {
		this.topics = topics;
		this.subject = subject;
		this.MAX_PLAYLISTS_TO_FETCH = '3';
		this.token = token;
		this.pf = new PlaylistFetcher(subject);
	}

	async curate(videosDataFromDB: PlaylistGenerationTopic[]) {
		// If not in cache, fetch all playlists for subject 
		const fetchedPlaylists: YouTubePlaylistsResponse = await checkInCacheThenCall(
			`${CK_COOKED_PLAYLIST_LIST}#${this.token}`,
			() => this.pf.fetchPlaylistsOfSubject()
		);

		// If not in cache, fetch all videos of playlists 
		const fetchedVideos: YouTubeVideoApiResponse[] = await checkInCacheThenCall(
			`${CK_CHANNELS_WITH_VIDEOS_TITLES}#${this.token}`,
			() => this.pf.fetchVideosOfSubjectPlaylists()
		);

		// Extract videos data 
		const vde = new VideoDataExtractor(fetchedVideos);

		// If not in cache, fetch stats for all extracted videos 
		const videoIdToStatsMap: VideoIdToStats = await checkInCacheThenCall(
			`${CK_CHANNELS_STAT_MAP}#${this.token}`,
			() => this.pf.fetchVideosStatistics(vde.videoIds, process.env.YOUTUBE_API!)
		);

		// Extract mapped data of channel to video details and channel to topics
		const customVideoDetails = vde.extractVideosDetails(videoIdToStatsMap);
		const channelListWithVideoDetails: ExtractedVideoDataWithChannelDetail[] = customVideoDetails.channelsListWithVideoDetails!;
		const channelsListWithTopics: ChannelWithTopics = customVideoDetails.channelsListWithTopics!;

		// Send topics for analysis to LLM
		const analyzedSyllabus: AnalyzedSyllabus[] = await checkInCacheThenCall(
			`analyzed-topics-llm-response#${this.token}`,
			() => topicComparison(channelsListWithTopics!, this.topics)
		);

		// Map videos
		const mapper = new AnalyzedTopicsMapper(channelListWithVideoDetails, videosDataFromDB);
		const channelsWithAnalysisData: ChannelWithAnalysis[] = mapper.map(analyzedSyllabus);

		const insertPromises = channelsWithAnalysisData.map(
			channelWithAnalysisData => prisma.chapterAnalysis.create({ data: channelWithAnalysisData })
		)
		await prisma.$transaction(insertPromises);
	}
}