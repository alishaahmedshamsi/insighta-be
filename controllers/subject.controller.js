import mongoose from 'mongoose';
import { createSubject, fetchSubject } from '../models/subject.model.js';
import { getAllUsers } from '../models/user.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const createSubjects = asyncHandler(async (req, res, next) => {
    
        req.body.school = req.user.id;
        const data = await createSubject(req.body);
        generateResponse(data, 'Subjects created successfully', res);
    })

export const getSubects = asyncHandler(async (req, res, next) => {
    const data  = await fetchSubject({school:req.user.id,class:req.params.id});
    generateResponse(data, 'Subjects fetched successfully', res);
})
