import { getAssignments } from '../models/assignment.model.js';
import { getLectures } from '../models/lecture.model.js';
import { findQuizzes } from '../models/quiz.model.js';
import { STATUS_CODES } from '../utils/constants.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const fetchStudentsQuiz = asyncHandler(async (req, res) => {
    
    if(req.query.subject === undefined){
        return next({
            message: "Subject is required",
            statusCode: STATUS_CODES.BAD_REQUEST,
        })
    }

    const quiz = await findQuizzes({subject:req.query.subject });
    generateResponse(quiz, "Students fetched successfully", res);
});


export const fetchStudentAssignment = asyncHandler(async (req, res) => {
        
        if(req.query.subject === undefined){
            return next({
                message: "Subject is required",
                statusCode: STATUS_CODES.BAD_REQUEST,
            })
        }
    
        const quiz = await getAssignments({subject:req.query.subject});
        generateResponse(quiz, "Students fetched successfully", res);
    });


export const fetchStudentLecture = asyncHandler(async (req, res) => {
    if(req.query.subject === undefined){
        return next({
            message: "Subject is required",
            statusCode: STATUS_CODES.BAD_REQUEST,
        })
    }

    const quiz = await getLectures({subject:req.query.subject});
    generateResponse(quiz, "Students fetched successfully", res);
})

