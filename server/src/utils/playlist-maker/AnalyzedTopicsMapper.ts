import {
  AnalysisData,
  AnalyzedSyllabus,
  ChannelWithAnalysis,
  ExtractedVideoDataWithChannelDetail,
  PlaylistGenerationTopic
} from '../../types/cookedcourse';

export class AnalyzedTopicsMapper {
  constructor(
    private readonly channelsWithDetails: ExtractedVideoDataWithChannelDetail[],
    private readonly chaptersWithTopics: PlaylistGenerationTopic[]
  ) {
    this.channelsWithDetails = channelsWithDetails;
    this.chaptersWithTopics = chaptersWithTopics;
  }

  map(analyzedSyllabuses: AnalyzedSyllabus[]): ChannelWithAnalysis[] {
    return analyzedSyllabuses.flatMap((analyzedSyllabus: AnalyzedSyllabus) =>
      this.mapTopic(analyzedSyllabus)
    );
  }

  private mapTopic(analyzedSyllabus: AnalyzedSyllabus): ChannelWithAnalysis[] {
    const channelWithDetails: ExtractedVideoDataWithChannelDetail =
      this.findChannelWithDetails(analyzedSyllabus.channelName);

    return analyzedSyllabus.analyzedPlaylistData.sylabus_analysis.map(
      (analysisData) => this.mapAnalysis(analyzedSyllabus, analysisData, channelWithDetails)
    );
  }

  private mapAnalysis(
    analyzedSyllabus: AnalyzedSyllabus,
    analysisData: AnalysisData,
    channelWithDetails: ExtractedVideoDataWithChannelDetail
  ): ChannelWithAnalysis {
    const chapter: PlaylistGenerationTopic = this.findChapter(analysisData.unit_name);

    return {
      channelName: analyzedSyllabus.channelName,
      matchedSyllabusTopics: analysisData.matched_videos_titles,
      unmatchedSyllabusTopics: analysisData.unmatched_topics,
      unitCoveragePercentage: analysisData.unit_coverage_percentage,
      chapterId: chapter.id,
      matchedYoutubeTitles: {
        create: this.findMatchedVideos(channelWithDetails, analysisData.matched_videos_titles),
      },
    };
  }

  private findChannelWithDetails(
    channelName: string
  ): ExtractedVideoDataWithChannelDetail {
    return this.channelsWithDetails.find(
      (channel) => channel.channelName === channelName
    )!;
  }

  private findChapter(
    chapterName: string,
  ): PlaylistGenerationTopic {
    const chapter = this.chaptersWithTopics.find((chapter) => chapter.name === chapterName);

    if (!chapter) {
      throw new Error(
        `Chapter not found: ${chapterName}`
      );
    }

    return chapter;
  }

  private findMatchedVideos(
    channelWithDetails: ExtractedVideoDataWithChannelDetail,
    analysisMatchedVideoTitles: string[]
  ): {
    ytVideoTitle: string,
    ytVideoId: string,
    viewCount: string,
    duration: number
  }[] {
    if (!channelWithDetails) return [];

    return channelWithDetails.items
      .filter((channel) =>
        analysisMatchedVideoTitles.includes(channel.title)
      )
      .map((video) => ({
        ytVideoTitle: video.title,
        ytVideoId: video.videoId,
        viewCount: video.viewCount || '0',
        duration: video.durationInSeconds || 0,
      }));
  }
}