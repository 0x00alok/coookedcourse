import axios from 'axios';
import { axiosPostWithRetry } from '../../utils/playlist-maker/playlistMakerUtils';

import { AnalyzedSyllabus, ChannelWithTopics, ChapterWithTopics, ExtractedTopic } from '../../types/cookedcourse';

// AI-AGENT API Route
const AGENT_ROUTE = 'http://agent_container:8000/api/v1/agent';

// Helper function to extract topics from input Syllabus
export const extractSyllabusTopics = async (
  toExtractChapters: string[] | []
): Promise<ExtractedTopic[]> => {
  try {
    let extractedTopics: ExtractedTopic[] = (await axios.post(`${AGENT_ROUTE}/generate-topics`, {
      syllabus: toExtractChapters
    })).data;

    return extractedTopics;
  } catch (err: any) {
    console.error(err);
    throw new Error("Could not extract Topics of Syllabus", { cause: err });
  }
}

export const topicComparison = async (
  channelToTopicsMap: ChannelWithTopics,
  chapterWithTopicsData: ChapterWithTopics[]
): Promise<AnalyzedSyllabus[]> => {
  // TODO: LLM must return syllabus topics mapped to respective 
  // youtube video titles/topics
  const payload = {
    syllabus_topics: chapterWithTopicsData,
    channel_topics: channelToTopicsMap
  }

  // Pass to LLM to analyze
  const analyzedSyllabus: AnalyzedSyllabus[] = await axiosPostWithRetry(process.env.LLM_ANALYZE_URL!, payload);

  return analyzedSyllabus!;
}