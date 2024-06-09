import { Router } from 'express';
import { teacherCreateAssignment, teacherCreateQuiz, teacherGetAssignments, teacherGetQuizzes } from '../controllers/teacher.controller.js';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../utils/helpers.js';

export default class TeacherAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/assignment',authMiddleware(Object.values(ROLES)),upload("teacher").fields([{name:'assignmentFile',maxCount:'1'}]),teacherCreateAssignment);
        this.router.post('/quiz',authMiddleware(Object.values(ROLES)),teacherCreateQuiz);
        this.router.get('/assignment',authMiddleware(Object.values(ROLES)),teacherGetAssignments);
        this.router.get('/quiz',authMiddleware(Object.values(ROLES)),teacherGetQuizzes);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/teacher';
    }
}
