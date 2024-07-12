import {  getLectures } from '../models/lecture.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

// export const fetchTeacherClassLecture = asyncHandler(async (req, res) => {
//     // const lectures = await createLecture(req.body);
    
//     if(!req.query.class){
//         return next({
//             message: "Class is required",
//             statusCode: STATUS_CODES.BAD_REQUEST,
//             });
//     }

//     const lecture = await getLectures({teacher: req.user.id,class:req.query.class});
//     generateResponse(lecture, "Lecture created successfully", res);
// });