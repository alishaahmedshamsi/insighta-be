import { Router } from 'express';
import { createClasses, fetchClasses } from '../controllers/class.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createSubjects, getSubects } from '../controllers/subject.controller.js';
import { classValidaton, subjectValidation } from '../validators/school.validator.js';
import { updateDisplayPoints, updateIsReviewOpen, users } from '../controllers/school.controller.js';

export default class SchoolAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/class-create',authMiddleware(Object.values(ROLES)),classValidaton ,createClasses);
        this.router.put('/update-display-points',authMiddleware(Object.values(ROLES)),updateDisplayPoints);
        this.router.put('/update-review-open',authMiddleware(Object.values(ROLES)),updateIsReviewOpen);
        this.router.get('/get-classes',authMiddleware(Object.values(ROLES)),fetchClasses);
        this.router.post('/subject-create',authMiddleware(Object.values(ROLES)),subjectValidation,createSubjects);
        this.router.get('/get/subjects/:id',authMiddleware(Object.values(ROLES)), getSubects);
        this.router.get('/fetch/users',authMiddleware(Object.values(ROLES)), users);
        
        
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/school';
    }
}
