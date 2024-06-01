import mongoose from 'mongoose';
import { createSubject, fetchSubject, findSubject } from '../models/subject.model.js';
import { getAllUsers } from '../models/user.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { STATUS_CODES } from '../utils/constants.js';

export const createSubjects = asyncHandler(async (req, res, next) => {

    const isSubjectExist = await findSubject({school:req.user.id, name:req.body.name});
    if(isSubjectExist) return next({
        statusCode:STATUS_CODES.BAD_REQUEST,
        message:"Subject already exist"
    })
        req.body.school = req.user.id;
        const data = await createSubject(req.body);
        generateResponse(data, 'Subjects created successfully', res);
    })

export const getSubects = asyncHandler(async (req, res, next) => {
    const data  = await fetchSubject({school:req.user.id,class:req.params.id});
    generateResponse(data, 'Subjects fetched successfully', res);
})
