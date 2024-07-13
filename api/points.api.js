import { Router } from 'express';
import { fetchGloabalTop5Users, fetchTop5Users } from '../controllers/school.controller.js';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { pointsLogs } from '../controllers/points.controller.js';
export default class PointsAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/',authMiddleware(Object.values(ROLES)),fetchTop5Users);
        this.router.get('/global',fetchGloabalTop5Users);
        this.router.get('/detail/log/:id',authMiddleware(Object.values(ROLES)),pointsLogs)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/point';
    }
}
