import prisma from '../../utils/prisma-client/getPrismaClient';
import { PlaylistMaker } from '../../utils/playlist-maker/PlaylistMaker';
import { extractSyllabusTopics } from '../llm/agentService';
import { saveTopicsToDB } from './cookedcourseDbService';
import { getRedisClient } from '../../utils/redis-client/getRedisClient';
import { unmatchedTopicsToVideosMapper } from '../../utils/playlist-maker/fallbackVideosUtils';

// TODO: Create a Class which deals with YT Api
export const createCourse = async (
  toExtractTopicsOfChapters,
  toAnalyzeChapters,
  alreadyExtractedChapters,
  clientId,
  currSubject,
  query
) => {
  console.log(toExtractTopicsOfChapters, alreadyExtractedChapters)

  // GET Topics of SYLLABUS from AI-AGENT, if course has not been generated
  // for the same SYLLABUS or UNITS
  if (toExtractTopicsOfChapters.length !== 0) {
    _extractChapterTopicsUsingLLM(toExtractTopicsOfChapters, clientId);
  }

  const subject: string = currSubject;
  const playlistGenerationTopics = [...toExtractTopicsOfChapters, ...toAnalyzeChapters];

  const playlistGenerationTopicsData = await prisma.chapter.findMany({
    where: { chapterData: { in: playlistGenerationTopics } },
    select: {
      id: true,
      name: true,
      topics: true
    }
  })

  // Playlist Maker Instance
  if (playlistGenerationTopics.length !== 0) {
    _generatePlaylistsUsingLLM(playlistGenerationTopicsData, subject, clientId, query);
  }

  // fetch all chapters from DB
  const allChapters = await prisma.chapter.findMany({
    where: { chapterData: { in: [...playlistGenerationTopics, ...alreadyExtractedChapters] } },
    include: {
      chapterAnalysis: {
        include: {
          matchedYoutubeTitles: true,
          fallbackVideos: true
        }
      }
    }
  })

  // Memory store to capture freshly fetched fallback configurations
  const fallbackInMemoryMap: Record<string, Array<{ topicName: string; ytVideoTitle: string; ytVideoId: string, viewCount: string, duration: number }>> = {};

  if (Object.keys(playlistGenerationTopics).length !== 0) {
    // Map unique unmatched topics ONLY if they have not been processed previously
    unmatchedTopicsToVideosMapper(allChapters, subject, fallbackInMemoryMap);
  }

  // These are used for navigation, for now
  const navChapters = allChapters.map(ch => ({
    id: ch.id,
    name: ch.name
  }));

  // Set to add only unique channels
  const uniqueChannels = new Set();
  const analysisMap = {};

  allChapters.forEach(chapter => {
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

      const freshFallbackVideos = fallbackInMemoryMap[analysis.id] || [];

      const combinedFallbacksMap = new Map<string, { topicName: string; ytVideoTitle: string; ytVideoId: string, viewCount: string, duration: number }>();
      [...savedFallbackVideos, ...freshFallbackVideos].forEach(item => {
        combinedFallbacksMap.set(item.topicName.toLowerCase().trim(), item);
      });

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
        fallbackVideos: Array.from(combinedFallbacksMap.values())
      };
    });
  });

  return { navChapters, uniqueChannels, analysisMap }
}

const _extractChapterTopicsUsingLLM = async (toExtractTopicsOfChapters, clientId) => {
  let newExtractedTopics: string | "";
  if (!(await (await getRedisClient()).get(`new-extracted-topics#${clientId}`))) {
    newExtractedTopics = await extractSyllabusTopics(toExtractTopicsOfChapters);
    (await getRedisClient()).set(`new-extracted-topics#${clientId}`, JSON.stringify(newExtractedTopics))
  }

  const cachedExtractedTopics = await (await getRedisClient()).get(`new-extracted-topics#${clientId}`)

  newExtractedTopics = cachedExtractedTopics ? JSON.parse(cachedExtractedTopics) : null;

  await saveTopicsToDB(toExtractTopicsOfChapters, newExtractedTopics);
}

const _generatePlaylistsUsingLLM = async (playlistGenerationTopicsData, subject, clientId, query) => {
  const pm = new PlaylistMaker(playlistGenerationTopicsData, subject);
  const { analyzedTopicsToSave } = await pm.fetchPlaylistVideos(clientId, query, playlistGenerationTopicsData);

  const insertPromises = analyzedTopicsToSave.map(analyzedTopic => prisma.chapterAnalysis.create({ data: analyzedTopic }))
  await prisma.$transaction(insertPromises);
}