import express from 'express';
import {authenticateToken} from '../middlewares/auth.js';
import * as lessonController from '../controllers/lesson.js';

const router = express.Router();

router.post('/group', authenticateToken, lessonController.createLesson);

router.post('/requestPrivateLesson', lessonController.requestPrivateLesson);

router.put('/approveLink/:lessonId', authenticateToken, lessonController.approvePrivateLesson)

router.put('/:lessonId,', authenticateToken, lessonController.updateLesson);

router.delete('/:lessonId', authenticateToken, lessonController.deleteLesson);

router.post('/week', lessonController.getWeeklyLessons);

export default router;
