import { Chapter } from '../types/cookedcourse';
import prisma from '../utils/prisma-client/getPrismaClient';

const getChapterByChapterData = async (chapterData: string) => {
  const chapter = await prisma.chapter.findFirst({
    where: {
      chapterData: chapterData,
    }
  });

  return chapter;
}

const getChapterByChapterDataWithAnalysis = async (chapterData: string) => {
  const chapter = await prisma.chapter.findFirst({
    where: {
      chapterData: chapterData,
    },
    include: {
      chapterAnalysis: true
    }
  });

  return chapter;
}

const getChaptersByIds = async (chapterIds: string[]) => {
  const chapters = await prisma.chapter.findMany({
    where: { id: { in: chapterIds } },
    include: {
      chapterAnalysis: {
        include: {
          matchedYoutubeTitles: true,
          fallbackVideos: true
        }
      }
    }
  });

  return chapters;
}

const createChapters = async (chapters: Chapter[]) => {
  const newChapters = await prisma.chapter.createMany({
    data: chapters
  })

  return newChapters;
}

export {
  getChapterByChapterData,
  getChapterByChapterDataWithAnalysis,
  getChaptersByIds,
  createChapters
};