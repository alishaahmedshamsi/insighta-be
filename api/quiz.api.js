import { Router } from 'express';
import { fetchQuiz, fetchQuizzes, makeQuiz } from '../controllers/quiz.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

export default class QuizAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/',authMiddleware(ROLES.TEACHER),makeQuiz);
        this.router.get('/:id',authMiddleware(Object.values(ROLES)),fetchQuiz);
        this.router.get('/',authMiddleware(Object.values(ROLES)),fetchQuizzes);
        this.router.post('/fetch',authMiddleware(Object.values(ROLES)),fetchQuizzes);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/quiz';
    }
}
