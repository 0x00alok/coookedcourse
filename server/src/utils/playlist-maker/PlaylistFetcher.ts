import axios from 'axios';
import { VideoIdToStats, YouTubePlaylistsResponse, YouTubeVideoData, YouTubeVideoStats } from '../../types/cookedcourse';
import { axiosGetWithRetry, extractPlaylistIds, parseYouTubeDuration } from './playlistMakerUtils';

export class PlaylistFetcher {
	public subject: string;
	private subjectPlaylistURL: string;
	private subjectPlaylistIds: string[] | [];

	constructor(subject: string) {
		this.subject = subject;
		this.subjectPlaylistURL = this.makePlaylistURL();
		this.subjectPlaylistIds = [];
	}

	private makePlaylistURL(): string {
		return process.env.SEARCH_PLAYLIST_URL!
			.replace('[MAX_PLAYLISTS_TO_FETCH]', '3')
			.replace('[SUBJECT]', this.subject)
			.replace('[YOUR_API_KEY]', process.env.YOUTUBE_API!)
	}

	private makeVideosOfPlaylistURL(playlistId: string): string {
		return process.env.SEARCH_PLAYLIST_VIDEOS_URL!.
			replace('[PLAYLIST_ID]', playlistId).
			replace('[YOUR_API_KEY]', process.env.YOUTUBE_API!)
	}

	// Fetches all playlists for relevant subject 
	async fetchPlaylistsOfSubject(): Promise<YouTubePlaylistsResponse> {
		let fetchedPlaylists: YouTubePlaylistsResponse = (await axios.get(this.subjectPlaylistURL)).data;

		// Set playlist ids after it's fetched 
		this.subjectPlaylistIds = extractPlaylistIds(fetchedPlaylists.items);

		return fetchedPlaylists;
	}

	// Fetch all videos of retrieved playlists
	async fetchVideosOfSubjectPlaylists(): Promise<PromiseSettledResult<YouTubeVideoData[]>[]> {
		// Make playlist video URLs before fetching
		const playlistVideoURLS: string[] = this.subjectPlaylistIds.map((playlistId: string) => this.makeVideosOfPlaylistURL(playlistId));

		const promises = playlistVideoURLS.map(url => this.fetchVideosOfSubjectPlaylist(url));

		return Promise.allSettled(promises);
	}

	// Fetch single playlist's videos from URL
	async fetchVideosOfSubjectPlaylist(playlistURL: string): Promise<YouTubeVideoData[]> {
		let allItems = [];
		let nextPageToken = null;
		let isFirstRequest = true;

		do {
			const urlToFetch = isFirstRequest ? playlistURL : `${playlistURL}&pageToken=${nextPageToken}`;

			const res = await axiosGetWithRetry(urlToFetch);

			if (res.items) {
				allItems.push(...res.items);
			}

			// Update the token for the next iteration
			nextPageToken = res.nextPageToken;
			isFirstRequest = false;

		} while (nextPageToken);

		return allItems;
	}

	// Helper to fetch statistics for a list of video IDs in batches of 50
	async fetchVideosStatistics(
		videoIds: string[],
		apiKey: string,
		retries = 3
	): Promise<VideoIdToStats> {
		// To store map of video id to video's stats
		const videoIdToStatsMap: VideoIdToStats = {};

		if (!videoIds.length) return videoIdToStatsMap;

		// Combine video ids in chunks to fetch stats
		const chunkArray = (arr: string[], size: number): string[][] => {
			const chunks = [];
			for (let i = 0; i < arr.length; i += size) {
				chunks.push(arr.slice(i, i + size));
			}
			return chunks;
		};

		const idChunks: string[][] = chunkArray(videoIds, 50);
		const statsUrls: string[] = idChunks.map(chunk =>
			`https://youtube.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${chunk.join(',')}&key=${apiKey}`
		);

		// Fetch batches in parallel ???
		const results: PromiseSettledResult<YouTubeVideoStats>[] = await Promise.allSettled(
			statsUrls.map(url => axiosGetWithRetry(url, retries))
		);

		results.forEach(res => {
			if (res.status === 'fulfilled' && res.value?.items) {
				res.value.items.forEach((item: any) => {
					const rawDuration = item.contentDetails?.duration || 'PT0S';

					videoIdToStatsMap[item.id] = {
						viewCount: item.statistics?.viewCount || '0',
						durationInSeconds: parseYouTubeDuration(rawDuration),
						durationIso: rawDuration
					};
				});
			}
		});

		return videoIdToStatsMap;
	};
}