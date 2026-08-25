import { ChannelUtils } from './ChannelUtils';

export class AnalyzedTopicsMapper {
  private cu: ChannelUtils;

  constructor(
    private readonly channels,
    private readonly chapters
  ) {
    this.cu = new ChannelUtils(channels, chapters);
  }

  map(analyzedTopics) {
    return analyzedTopics.flatMap((topic) =>
      this.mapTopic(topic)
    );
  }

  private mapTopic(topic) {
    const channel = this.cu.findChannel(topic.channelName);

    return topic.analyzedPlaylistData.sylabus_analysis.map(
      (analysis) => this.mapAnalysis(topic, analysis, channel)
    );
  }

  private mapAnalysis(topic, analysis, channel) {
    const chapter = findChapter(analysis.unit_name, this.chapters);

    return {
      channelName: topic.channelName,
      matchedSyllabusTopics: analysis.matched_videos_titles,
      unmatchedSyllabusTopics: analysis.unmatched_topics,
      unitCoveragePercentage: analysis.unit_coverage_percentage,
      chapterId: chapter.id,
      matchedYoutubeTitles: {
        create: this.cu.findMatchedVideos(channel, analysis.matched_videos_titles),
      },
    };
  }
}

function findChapter(unitName: string, chapters) {
  const chapter = chapters.find((chapter) => chapter.name === unitName);

  if (!chapter) {
    throw new Error(
      `Chapter not found: ${unitName}`
    );
  }

  return chapter;
}