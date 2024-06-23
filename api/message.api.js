import { Router } from 'express';
import { defaultHandler } from '../controllers/index.js';
import { fetchMessages, sendMessages } from '../controllers/message.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

export default class MessageAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/',authMiddleware(Object.values(ROLES)),sendMessages);
        this.router.get('/:id',authMiddleware(Object.values(ROLES)), fetchMessages);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/message';
    }
}
