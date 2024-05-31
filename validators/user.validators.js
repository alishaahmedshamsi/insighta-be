import Joi from "joi";
import { validateBody } from "./validate.js";

const addOrUpdateUserValidator = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(8).required(),
});

const updateUserInfomation = Joi.object({
    fullname: Joi.string().trim().required(),
    location: Joi.string().trim().optional(),
});

export const updateUserInfo = validateBody(updateUserInfomation);
export const userUpdateValidation = validateBody(addOrUpdateUserValidator);