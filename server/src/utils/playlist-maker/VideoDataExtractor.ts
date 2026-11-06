import type {
  ChannelWithTopics,
  ExtractedVideoData,
  ExtractedVideoDataWithChannelDetail,
  VideoIdToStats,
  YouTubeVideoApiResponse,
  YouTubeVideoData,
  YouTubeVideoSnippet
} from '../../types/cookedcourse';


export class VideoDataExtractor {
  // List of raw yt api response of playlist videos
  private videoList: YouTubeVideoApiResponse[];

  public channelsListWithTopics: ChannelWithTopics = {};
  // To map video titles of each channel's videos to channel's name
  public channelsListWithVideoDetails?: ExtractedVideoDataWithChannelDetail[];
  public videoIds: string[];

  constructor(videoList: YouTubeVideoApiResponse[]) {
    this.videoList = videoList;

    // Extract video ids to use in fetching video's statistics  
    this.videoIds = this.getAllVideoIds();
  }

  // Extracts all unique video IDs from raw playlist items
  getAllVideoIds(): string[] {
    const ids: string[] = [];
    this.videoList.forEach((playlistResult: any) => {
      if (playlistResult.status === 'fulfilled' && playlistResult.value) {
        playlistResult.value.forEach((item: any) => {
          if (item.contentDetails?.videoId) {
            ids.push(item.contentDetails.videoId);
          }
        });
      }
    });
    return ids;
  }

  // Extracts details of each channel's video
  extractVideosDetails(videoIdToStatsMap: VideoIdToStats) {
    this.channelsListWithVideoDetails = this.videoList.reduce(
      (acc: any, videDetailsItem: YouTubeVideoApiResponse, i) => {
        if (videDetailsItem.status === 'fulfilled' && videDetailsItem.value) {
          // Stores playlist's all videos data
          const allVideosData: YouTubeVideoData[] = videDetailsItem.value;
          const firstItemSnippet: YouTubeVideoSnippet = allVideosData[i].snippet;
          const channelName = firstItemSnippet.channelTitle;

          // TODO: Better custom data extraction
          const videoItems: ExtractedVideoData[] = allVideosData.map((videoData: YouTubeVideoData) => {
            // Extract video's stats data from map
            const vId = videoData.contentDetails.videoId;
            const metrics = videoIdToStatsMap[vId] || { viewCount: "0", durationInSeconds: 0, durationIso: "PT0S" };

            // Extract relevant video details 
            const extractedVideoData = {
              itemId: videoData.id,
              title: videoData.snippet.title,
              videoId: vId,
              viewCount: metrics.viewCount,
              durationInSeconds: metrics.durationInSeconds,
              durationIso: metrics.durationIso
            }

            // If the channelName doesn't exist as a key, create it
            if (!this.channelsListWithTopics![channelName]) {
              this.channelsListWithTopics![channelName] = [];
            }

            // Push video title into channel's specific array 
            this.channelsListWithTopics![channelName].push(videoData.snippet.title);

            return { ...extractedVideoData };
          });

          // Add channel details to it's video items
          const channelObject: ExtractedVideoDataWithChannelDetail = {
            channelName,
            channelId: firstItemSnippet.channelId,
            playlistId: firstItemSnippet.playlistId,
            items: videoItems,
          };

          acc.push(channelObject);
        }

        return acc;
      }, []);

    return this;
  }

  // Extract video topics of each channel's videos
  extractVideosTopics(): ChannelWithTopics {
    this.channelsListWithTopics = this.videoList.reduce((acc: any, videoListItem: YouTubeVideoApiResponse) => {
      if (videoListItem.status === 'fulfilled' && videoListItem.value) {
        videoListItem.value.forEach((videoItem: YouTubeVideoData) => {
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

    return this.channelsListWithTopics!;
  }
}