import { Router } from 'express';
import RootAPI from './root.api.js';
import AuthAPI from './auth.api.js';
import UserAPI from './user.api.js';
import AdminAPI from './admin.api.js';
import SchoolAPI from './school.api.js';

export default class API {
    constructor(app) {
        this.app = app;
        this.router = Router();
        this.routeGroups = [];
    }

    loadRouteGroups() {
        this.routeGroups.push(new RootAPI());
        this.routeGroups.push(new AuthAPI());
        this.routeGroups.push(new UserAPI());
        this.routeGroups.push(new AdminAPI());
        this.routeGroups.push(new SchoolAPI());
    }

    setContentType(req, res, next) {
        res.set('Content-Type', 'application/json');
        next();
    }

    registerGroups() {
        this.loadRouteGroups();
        this.routeGroups.forEach((rg) => {
            console.log('Route group: ' + rg.getRouterGroup());
            this.app.use('/api' + rg.getRouterGroup(), this.setContentType, rg.getRouter());
        });
    }
}