import { createAssignment, getAssignments } from '../models/assignment.model.js';
import { createLecture } from '../models/lecture.model.js';
import { getPoints } from '../models/points.model.js';
import { createQuiz, findQuizzes } from '../models/quiz.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const teacherCreateAssignment = asyncHandler(async (req, res) => {
    const createdBy = req.user.id;
    req.body.createdBy = createdBy;
    if(!req.files.assignmentFile){
        return next({
            message: "Assignment file is required",
            statusCode: STATUS_CODES.BAD_REQUEST,
          });
    }

    if(req?.files?.assignmentFile){
        let assignmentFile = await uploadOnCloudinary(req?.files?.assignmentFile[0].path);
        if (!assignmentFile) {
          return next({
            message: "Assignment file failed why uploading on cloudinary",
            statusCode: STATUS_CODES.BAD_REQUEST,
          });
        }
        req.body.assignmentFile = assignmentFile.secure_url;
    }
    const assignment = await createAssignment(req.body);
    const teacher = await getPoints({ user: createdBy });
    teacher.assignment += 20;
    await teacher.save();
    
    generateResponse(assignment,"Assignment created successfully",res);
});

export const teacherGetAssignments = asyncHandler(async (req, res) => {
    const subject = req.query.subject;
    const filter = {
        createdBy: req.user.id
    };
    if(subject){
        filter.subject = subject;
    }

    const assignments = await getAssignments(filter);
    generateResponse(assignments,"Assignments fetched successfully",res);
});

export const teacherCreateQuiz = asyncHandler(async (req, res) => {
    const createdBy = req.user.id;
    req.body.createdBy = createdBy;
    const quiz = await createQuiz(req.body);
    const teacher = await getPoints({ user: createdBy });
    teacher.quiz += 30;
    await teacher.save();
    generateResponse(quiz,"Quiz created successfully",res);
});

export const teacherGetQuizzes = asyncHandler(async (req, res,next) => {
    const quizzes = await findQuizzes({ createdBy: req.user.id });
    generateResponse(quizzes,"Quizzes fetched successfully",res);
});

export const createLectures = asyncHandler(async (req, res,next) => {
    try {
        const createdBy = req.user.id;
        req.body.teacher = createdBy
        
        if(req?.files?.lecture){
            let lectureFile = await uploadOnCloudinary(req?.files?.lecture[0].path);
            if (!lectureFile) {
              return next({
                message: "Lecture file failed why uploading on cloudinary",
                statusCode: STATUS_CODES.BAD_REQUEST,
              });
            }
            console.log(lectureFile.secure_url);
            req.body.lecture = lectureFile.secure_url;
        }
        const lecture = await createLecture(req.body);
        const teacher = await getPoints({ user: createdBy });
        teacher.lecture += 10;
        await teacher.save();
        generateResponse(lecture,"Lecture created successfully",res);
    } catch (error) {
        console.log(error);
    }
   
})