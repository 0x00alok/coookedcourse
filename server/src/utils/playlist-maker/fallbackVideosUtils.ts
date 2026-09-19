import axios from 'axios';
import prisma from '../prisma-client/getPrismaClient';

export const unmatchedTopicsToVideosMapper = async (allChapters, subject: string) => {
  // Map unique unmatched topics ONLY if they have not been processed previously
  const topicToAnalysisMap = new Map<string, { topic: string; analysisIds: string[] }>();

  // Maps unique id to unmatched topics and it's analysisId
  _topicsToAnalysisMapper(topicToAnalysisMap, allChapters);

  // Only consume API quotas if there are un-cached elements left to process
  if (topicToAnalysisMap.size > 0) {
    await _searchUnmatchedTopicVideo(topicToAnalysisMap, subject);
  }
}

// TODO: Improve & Make Re-usable
function _topicsToAnalysisMapper(topicToAnalysisMap, allChapters) {
  allChapters.forEach(chapter => {
    chapter.chapterAnalysis.forEach(analysis => {
      // If this analysis already has fallback entries in DB, skip generation entirely
      // TODO: What if present fallback videos are partial ? 
      if (analysis.fallbackVideos && analysis.fallbackVideos.length > 0) {
        return;
      }

      analysis.unmatchedSyllabusTopics.forEach(topic => {
        const uniqueKey = `${chapter.id}-${topic.trim().toLowerCase()}`;

        if (!topicToAnalysisMap.has(uniqueKey)) {
          topicToAnalysisMap.set(uniqueKey, {
            topic: topic.trim(),
            analysisIds: [analysis.id]
          });
        } else {
          topicToAnalysisMap.get(uniqueKey)!.analysisIds.push(analysis.id);
        }
      });
    });
  });
}

async function _searchUnmatchedTopicVideo(topicToAnalysisMap, subject) {
  const fallbackPromises: any[] = [];

  for (const [_, item] of topicToAnalysisMap) {
    try {
      const searchQuery = encodeURIComponent(`${subject} ${item.topic} engineering`);
      const ytSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${searchQuery}&key=${process.env.YOUTUBE_API}`;

      const response = await axios.get(ytSearchUrl);
      const searchItems = response.data?.items;

      if (searchItems && searchItems.length > 0) {
        const topVideo = searchItems[0];
        const videoData = {
          topicName: item.topic,
          ytVideoTitle: topVideo.snippet.title,
          ytVideoId: topVideo.id.videoId
        };

        item.analysisIds.forEach(analysisId => {
          // Queue write transactions to persistent DB
          fallbackPromises.push(
            prisma.chapterAnalysisFallback.create({
              data: {
                ...videoData,
                chapterAnalysisId: analysisId
              }
            })
          );
        });
      }
    } catch (error) {
      console.error(`Failed fallback fetch for topic: ${item.topic}`, error?.message);
      continue;
    }
  }

  if (fallbackPromises.length > 0) {
    await prisma.$transaction(fallbackPromises);
  }
}