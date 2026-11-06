import { Request, Response } from 'express';
import { getChaptersByIds } from '../db/chapter.db';

const getChapterAnalysis = async (req: Request, res: Response) => {
  try {
    const { ids: chapterAnalysisIds } = req.query;

    if (!chapterAnalysisIds) throw Error("No ids to fetch");

    const chapterAnalysisIdsArray = (chapterAnalysisIds as string).split(",");

    const chapters = await getChaptersByIds(chapterAnalysisIdsArray);

    res.status(200).json({ chapters });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: err.message
    })
  }
}

const getChapterAnalysisDashboard = async (req: Request, res: Response) => {
  try {
    const { ids: chapterAnalysisIds } = req.query;

    if (!chapterAnalysisIds) throw Error("No ids to fetch");

    const chapterAnalysisIdsArray = (chapterAnalysisIds as string).split(",");

    const chapters = await getChaptersByIds(chapterAnalysisIdsArray);

    const navChapters = chapters.map(ch => ({ id: ch.id, name: ch.name }));

    const uniqueChannels = new Set();
    const analysisMap = {} as any;

    chapters.forEach(chapter => {
      chapter.chapterAnalysis.forEach(analysis => {
        const channelName = analysis.channelName;
        uniqueChannels.add(channelName);

        // channel key
        if (!analysisMap[channelName]) {
          analysisMap[channelName] = {};
        }

        const savedFallbackVideos = analysis.fallbackVideos?.map(fb => ({
          topicName: fb.topicName,
          ytVideoTitle: fb.ytVideoTitle,
          ytVideoId: fb.ytVideoId,
          viewCount: (fb as any).viewCount || '0',
          duration: (fb as any).duration || 0
        })) || [];

        // Map data directly to the specific chapter ID
        analysisMap[channelName][chapter.id] = {
          analysisId: analysis.id,
          unitCoveragePercentage: analysis.unitCoveragePercentage,
          matchedSyllabusTopics: analysis.matchedSyllabusTopics,
          unmatchedSyllabusTopics: analysis.unmatchedSyllabusTopics,
          videos: analysis.matchedYoutubeTitles.map(vid => ({
            ytVideoTitle: vid.ytVideoTitle,
            ytVideoId: vid.ytVideoId,
            viewCount: vid.viewCount || '0',
            duration: vid.duration || 0
          })),
          fallbackVideos: savedFallbackVideos
        };
      });
    });

    res.status(200).json({ navChapters, uniqueChannels, analysisMap });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: err.message
    })
  }
}

export default {
  getChapterAnalysis,
  getChapterAnalysisDashboard
};