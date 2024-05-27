import { Router } from 'express';
import { currentUser, forgetPassword, login, logout, register, resetPassword, verifyOtp } from '../controllers/index.js';
import { forgetPasswordValidation, loginValidation, registerValidation, resetPasswordValidation, verifyOtpValidation } from '../validators/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

export default class AuthAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/register',authMiddleware(Object.values(ROLES)),registerValidation, register);
        this.router.post('/login', loginValidation, login);
        this.router.put('/forget', forgetPasswordValidation, forgetPassword);
        this.router.put('/reset',authMiddleware(Object.values(ROLES)),resetPasswordValidation, resetPassword);
        this.router.put('/verify', verifyOtpValidation, verifyOtp);
        this.router.get('/current-user',authMiddleware(Object.values(ROLES)),currentUser)
        this.router.post('/logout',authMiddleware(Object.values(ROLES)),logout)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}