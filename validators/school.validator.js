import Joi from "joi";
import { validateBody } from "./validate.js";


 const classValidator = Joi.object({
    className: Joi.string().required(),
});

 const subjectValidator = Joi.object({
    name: Joi.string().required(),
    class: Joi.string().required(),
});


export const classValidaton = validateBody(classValidator);
export const subjectValidation = validateBody(subjectValidator);
