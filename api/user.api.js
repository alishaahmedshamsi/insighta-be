import { Router } from 'express';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/index.js';
import { fetchAllUsers, fetchUser, updateUser } from '../controllers/index.js';
import { objectIdParamValidation, updateUserInfo  } from '../validators/index.js';
import { upload } from '../utils/helpers.js';

export default class UserAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        const router = this.router;

        router.get('/', authMiddleware(Object.values(ROLES)), fetchAllUsers);
        router.get('/:userId', authMiddleware(Object.values(ROLES)), objectIdParamValidation('userId'), fetchUser);
        router.put('/', authMiddleware(Object.values(ROLES)),upload("user").fields([{name:'image',maxCount:'1'}]),updateUserInfo,updateUser);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}