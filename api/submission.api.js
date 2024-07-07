import { Router } from 'express';
import {  checkStatus, checkStatusQuiz, createSubmissions, deleteSubmission, fetchSubmissionById,  getSubmissions, updateSubmission } from '../controllers/submission.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { upload } from '../utils/helpers.js';

export default class SubmissionAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/',authMiddleware(Object.values(ROLES)),upload("assignment").fields([{name:'pdf',maxCount:'1'}]),createSubmissions);
        this.router.get('/',authMiddleware(Object.values(ROLES)),getSubmissions);
        this.router.get('/status',authMiddleware(Object.values(ROLES)),checkStatus);
        this.router.get('/status/quiz',authMiddleware(Object.values(ROLES)),checkStatusQuiz);
        this.router.get('/:id',authMiddleware(Object.values(ROLES)),fetchSubmissionById);
        this.router.put('/:id',authMiddleware(Object.values(ROLES)),updateSubmission);
        this.router.delete('/:id',authMiddleware(Object.values(ROLES)),deleteSubmission);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/submission';
    }
}
