import { Router } from 'express';
import { defaultHandler } from '../controllers/index.js';
import { createAnnouncements, fetchAnnouncements } from '../controllers/announcement.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

export default class AnnouncementAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/',authMiddleware(Object.values(ROLES)),fetchAnnouncements);
        this.router.post('/',authMiddleware(Object.values(ROLES)),createAnnouncements);
    }


    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/announcement';
    }
}
