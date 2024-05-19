import Joi from "joi";
import { validateBody } from "./validate.js";

const addOrUpdateUserValidator = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(8).required(),
});

export const userUpdateValidation = validateBody(addOrUpdateUserValidator);