import { Router } from 'express';
import { findSchoolsInfomation } from '../controllers/admin.controller.js';

export default class AdminAPI {

    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/school', findSchoolsInfomation);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/admin';
    }
}
