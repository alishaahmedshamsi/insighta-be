import { Router } from 'express';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { fetchStudentAssignment, fetchStudentLecture, fetchStudentsQuiz, findReviewIfExist, lecturePoints, submitReview } from '../controllers/student.controller.js';

export default class StudentAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/student-quiz',authMiddleware(Object.values(ROLES)),fetchStudentsQuiz);
        this.router.get('/student-lecture/get',authMiddleware(Object.values(ROLES)),fetchStudentLecture);
        this.router.get('/student-assignment',authMiddleware(Object.values(ROLES)),fetchStudentAssignment);  
        this.router.post('/review',authMiddleware(Object.values(ROLES)),submitReview);
        this.router.get('/review',authMiddleware(Object.values(ROLES)),findReviewIfExist);
        this.router.put('/lecture/points',authMiddleware(Object.values(ROLES)),lecturePoints);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/student';
    }
}
