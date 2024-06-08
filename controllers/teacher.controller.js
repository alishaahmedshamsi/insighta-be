import { createAssignment, getAssignments } from '../models/assignment.model.js';
import { getPoints } from '../models/points.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const teacherCreateAssignment = asyncHandler(async (req, res) => {
    const createdBy = req.user._id;
    const assignment = await createAssignment(req.body);
    const teacher = await getPoints({ user: createdBy });
    teacher.assignment += 20;
    await teacher.save();
    
    generateResponse(assignment,"Assignment created successfully",res);
});

export const teacherGetAssignments = asyncHandler(async (req, res) => {
    const assignments = await getAssignments({ createdBy: req.user._id });
    generateResponse(assignments,"Assignments fetched successfully",res);
});

export const teacherCreateQuiz = asyncHandler(async (req, res) => {
    const createdBy = req.user._id;
    const quiz = await createQuiz(req.body);
    const teacher = await getPoints({ user: createdBy });
    teacher.quiz += 30;
    await teacher.save();
    generateResponse(quiz,"Quiz created successfully",res);
});

export const teacherGetQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await getQuizzes({ createdBy: req.user._id });
    generateResponse(quizzes,"Quizzes fetched successfully",res);
});