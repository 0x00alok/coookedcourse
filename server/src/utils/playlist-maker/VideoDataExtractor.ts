import type { CookedTopics } from '../../types/cookedcourse';
import type { AnalyzedSyllabus, LLMPassedSyllabusYoutubeTopics, VideoListItem } from '../../types/playlistMaker';
import { axiosPostWithRetry } from './playlistMakerUtils';

export class VideoDataExtractor {
    private videoList;
    private channelsListWithTopics?: VideoListItem[]
    private analyzedSyllabus?: AnalyzedSyllabus[];
    private channelsListWithVideoDetails?: any;

    constructor(videoList: any = '') {
        this.videoList = videoList;
    }

    /**
     * Extracts details of each channel's video
     */
    extractVideosDetails() {
        this.channelsListWithVideoDetails = this.videoList.reduce((acc: any, videDetailsItem: any) => {
            if (
                videDetailsItem.status === 'fulfilled' && videDetailsItem.value
            ) {
                const apiResponse = videDetailsItem.value;
                const firstItemSnippet = apiResponse[0].snippet;

                const videoItems = apiResponse.map((item: any) => {
                    return {
                        itemId: item.id,
                        title: item.snippet.title,
                        videoId: item.contentDetails.videoId,
                    };
                });

                // Add channel details to it's video items
                const channelObject = {
                    channelName: firstItemSnippet.channelTitle,
                    channelId: firstItemSnippet.channelId,
                    playlistId: firstItemSnippet.playlistId,
                    items: videoItems,
                };

                acc.push(channelObject);
            }

            return acc;
        }, []);

        return this.channelsListWithVideoDetails;
    }

    /**
     * Extract video topics of each channel's videos
     */
    extractVideosTopics() {
        this.channelsListWithTopics = this.videoList.reduce((acc: any, videoListItem: any) => {
            if (videoListItem.status === 'fulfilled' && videoListItem.value) {
                videoListItem.value.forEach((videoItem: any) => {
                    const { channelTitle, title } = videoItem.snippet;

                    // If the channelName doesn't exist as a key, create it
                    if (!acc[channelTitle]) {
                        acc[channelTitle] = [];
                    }

                    // Push the current video's title to the corresponding channelName array
                    acc[channelTitle].push(title);
                });
            }
            return acc;
        }, {});

        return this.channelsListWithTopics
    }

    async topicComparison(videoTitles: VideoListItem[], syllabusTopics: CookedTopics) {
        const payload = {
            syllabus_topics: syllabusTopics,
            channel_topics: videoTitles
        }

        // Pass to LLM to analyze
        this.analyzedSyllabus = await axiosPostWithRetry(process.env.LLM_ANALYZE_URL!, payload)

        return this.analyzedSyllabus;
    }
}