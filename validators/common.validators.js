import { asyncHandler } from "../utils/helpers.js";
import { STATUS_CODES } from "../utils/constants.js";
import { Types } from "mongoose";

export const objectIdParamValidation = (paramName) => asyncHandler(async (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params[paramName])) return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: `Invalid ${paramName}!`
    });
    next();
});