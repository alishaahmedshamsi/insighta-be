import Joi from "joi";
import { validateBody } from "./validate.js";


 const classValidator = Joi.object({
    className: Joi.number().required(),
});

 const subjectValidator = Joi.object({
    name: Joi.string().required(),
    class: Joi.number().required(),
});


export const classValidaton = validateBody(classValidator);
export const subjectValidation = validateBody(subjectValidator);
