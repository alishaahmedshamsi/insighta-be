import { createClass, getClass } from '../models/classes.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const createClasses = asyncHandler(async (req, res, next) => {
    const isClassExist = await getClass({name:req.body.name, school:req.user.id});
    
    if(isClassExist) return next({
        message: 'Class already exist',
        statusCode: 400
    })

    req.body.school = req.user.id;
    const data = await createClass(req.body);
    generateResponse(data, 'Classes created successfully', res);
})

export const fetchClasses = asyncHandler(async (req, res, next) => {
    const data  = await getClass({school:req.user.id});
    generateResponse(data, 'Classes fetched successfully', res);
})

