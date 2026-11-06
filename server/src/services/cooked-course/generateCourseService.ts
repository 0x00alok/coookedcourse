import prisma from '../../utils/prisma-client/getPrismaClient';
import { getRedisClient } from '../../utils/redis-client/getRedisClient';

import { CuratePlaylist } from '../../utils/playlist-maker/CuratePlaylist';
import { extractSyllabusTopics } from '../llm/agentService';
import { unmatchedTopicsToVideosMapper } from '../../utils/playlist-maker/fallbackVideosUtils';

import { createChapters } from '../../db/chapter.db';

import { Chapter, ChapterWithAnalysisAndFallback, ExtractedTopic, PlaylistGenerationTopic } from '../../types/cookedcourse';


export const createCourse = async (
  toExtractTopicsOfChapters: string[],
  toAnalyzeChapters: string[],
  alreadyExtractedChapters: string[],
  clientId: string,
  currSubject: string,
  query: any
) => {
  // GET Topics of SYLLABUS from AI-AGENT, if course has not been generated
  // for the same SYLLABUS or UNITS
  if (toExtractTopicsOfChapters.length !== 0) {
    const extractedTopics: ExtractedTopic[] = await _extractChapterTopicsUsingLLM(toExtractTopicsOfChapters, clientId);

    await createChapters(_convertExtractedTopicsToChapter(extractedTopics, toExtractTopicsOfChapters));
  }

  const subject: string = currSubject;
  const playlistGenerationTopics: string[] = [...toExtractTopicsOfChapters, ...toAnalyzeChapters];

  const playlistGenerationTopicsData: PlaylistGenerationTopic[] = await prisma.chapter.findMany({
    where: { chapterData: { in: playlistGenerationTopics } },
    select: {
      id: true,
      name: true,
      topics: true
    }
  })

  // Curate Playlists
  if (playlistGenerationTopics.length !== 0) {
    await _generatePlaylistsUsingLLM(playlistGenerationTopicsData, subject, clientId, query);
  }

  // Fetch all chapters from db to pass in curate fn
  let allChapters: ChapterWithAnalysisAndFallback[] = await prisma.chapter.findMany({
    where: { chapterData: { in: [...playlistGenerationTopics, ...alreadyExtractedChapters] } },
    include: {
      chapterAnalysis: {
        include: {
          matchedYoutubeTitles: true,
          fallbackVideos: true
        }
      }
    }
  });

  if (playlistGenerationTopics.length !== 0) {
    // Map unique unmatched topics ONLY if they have not been processed previously
    await unmatchedTopicsToVideosMapper(allChapters, subject);
  }

  return allChapters.map((chapter) => chapter.id);
}


// Topics Extractor from Syllabus using LLM
const _extractChapterTopicsUsingLLM = async (
  toExtractTopicsOfChapters: string[] | [],
  clientId: string
): Promise<ExtractedTopic[]> => {
  let newExtractedTopics: ExtractedTopic[];

  if (!(await (await getRedisClient()).get(`new-extracted-topics#${clientId}`))) {
    newExtractedTopics = await extractSyllabusTopics(toExtractTopicsOfChapters);
    (await getRedisClient()).set(`new-extracted-topics#${clientId}`, JSON.stringify(newExtractedTopics))
  }

  newExtractedTopics = JSON.parse((await (await getRedisClient()).get(`new-extracted-topics#${clientId}`))!) as unknown as ExtractedTopic[];

  return newExtractedTopics;
}

// Go to function to curate playlists
const _generatePlaylistsUsingLLM = async (
  playlistGenerationTopicsData: PlaylistGenerationTopic[],
  subject: string,
  clientId: string,
  query: any
) => {
  const cp = new CuratePlaylist(playlistGenerationTopicsData, subject, clientId);

  // Less Go!!
  await cp.curate(playlistGenerationTopicsData);
}

// Converts extracted topics from LLM into Chapter type 
const _convertExtractedTopicsToChapter = (
  extractedTopics: ExtractedTopic[],
  toExtractTopicsOfChapters: string[]
): Chapter[] => {
  const convertedTopics = toExtractTopicsOfChapters.flatMap((topic, i) => {
    // Extract topics of same unit with relevant chapter data for db
    return extractedTopics
      // Filter topics of same unit 
      .filter((topic) => Number(topic.unit - 1) === i)
      .map(({ unit, ...rest }) => rest)
      // Arrange data as required by the db
      .reduce((acc, extractedTopic) => {
        acc.name = extractedTopic.name ? extractedTopic.name : undefined;
        acc.chapterData = topic;
        acc.topics = extractedTopic.topics;

        return acc;
      }, {} as Chapter);
  })
  return convertedTopics;
}