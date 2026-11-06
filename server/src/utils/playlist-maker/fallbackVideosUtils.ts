import axios from 'axios';
import prisma from '../prisma-client/getPrismaClient';

import { ChapterWithAnalysisAndFallback } from '../../types/cookedcourse';

export const unmatchedTopicsToVideosMapper = async (
  allChapters: ChapterWithAnalysisAndFallback[],
  subject: string
) => {
  const dbPromises: any[] = [];

  for (const chapter of allChapters) {
    for (const analysis of chapter.chapterAnalysis) {

      // Skip analyses that already have fallback videos
      if (analysis.fallbackVideos?.length > 0) {
        continue;
      }

      for (const topic of analysis.unmatchedSyllabusTopics) {
        try {
          const searchQuery = encodeURIComponent(
            `${subject} ${topic} engineering`
          );

          const ytSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${searchQuery}&key=${process.env.YOUTUBE_API}`;

          const response = await axios.get(ytSearchUrl);
          const topVideo = response.data?.items?.[0];

          if (!topVideo) continue;

          dbPromises.push(
            prisma.chapterAnalysisFallback.create({
              data: {
                topicName: topic,
                ytVideoTitle: topVideo.snippet.title,
                ytVideoId: topVideo.id.videoId,
                chapterAnalysisId: analysis.id
              }
            })
          );

        } catch (error: any) {
          console.error(
            `Failed fallback fetch for topic: ${topic}`,
            error.message
          );
        }
      }
    }
  }

  if (dbPromises.length > 0) {
    await prisma.$transaction(dbPromises);
  }
};
