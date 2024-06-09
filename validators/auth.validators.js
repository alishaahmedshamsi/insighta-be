import Joi from "joi";
import { validateBody } from "./validate.js";
import { ROLES, STATUS_CODES } from "../utils/constants.js";
import { asyncHandler } from "../utils/helpers.js";
import { getUser } from "../models/index.js";

// user register validator
const userRegisterValidator = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLES)).required(),
    classes:Joi.array().items(Joi.string()).when('role',{
        is: ROLES.SCHOOL,
        then: Joi.forbidden(),
        otherwise: Joi.required()
    }),
    rollnumber:Joi.string().optional(),
    subject:Joi.array().items(Joi.string()).optional()
});
// Validate email
export const emailExistsValidator = asyncHandler(async (req, res, next) => {
    const user = await getUser({ email: req.body.email });
    if (user) return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: "Email already exists!"
    });
    next();
});

// user login validator
const userLoginValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required()
});

const forgetPasswordValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required()
});

const verifyOtpValidator = Joi.object({
    email: Joi.string().required(),
    otp: Joi.number().required()
});

const resetPasswordValidator = Joi.object({
    password: Joi.string().required()
});



export const registerValidation = [validateBody(userRegisterValidator), emailExistsValidator];
export const loginValidation = validateBody(userLoginValidator);
export const forgetPasswordValidation = validateBody(forgetPasswordValidator);
export const verifyOtpValidation = validateBody(verifyOtpValidator);
export const resetPasswordValidation = validateBody(resetPasswordValidator);