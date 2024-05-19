import { Router } from 'express';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/index.js';
import { fetchAllUsers, fetchUser } from '../controllers/index.js';
import { objectIdParamValidation } from '../validators/index.js';

export default class UserAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        const router = this.router;

        router.get('/', authMiddleware(Object.values(ROLES)), fetchAllUsers);
        router.get('/:userId', authMiddleware(Object.values(ROLES)), objectIdParamValidation('userId'), fetchUser);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}