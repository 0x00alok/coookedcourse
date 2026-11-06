import express from 'express';

import chapterController from '../controllers/chapterController';

const router = express();

router.
  route('/').
  get(chapterController.getChapterAnalysis);

router.
  route('/dashboard-view').
  get(chapterController.getChapterAnalysisDashboard);

export default router;