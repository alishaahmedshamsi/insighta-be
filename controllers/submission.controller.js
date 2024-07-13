import mongoose from "mongoose";
import { getPoints } from "../models/points.model.js";
import { createSubmission, deleteSubmissions, getSubmission, getSubmissionById, updateSubmissions } from "../models/submission.model.js";
import { getUser } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { STATUS_CODES } from "../utils/constants.js";
import { generateResponse,asyncHandler } from "../utils/helpers.js";
import { createPointsLog } from "../models/pointsLog.model.js";

export const createSubmissions = asyncHandler(async (req, res, next) => {
    req.body.student = req.user.id;
    req.body.isQuiz = req.body.isQuiz === 'true' ? true : false;

    let findSubmission;

    if(req.body.isQuiz){
        findSubmission = await getSubmissionById({ student: req.user.id,quizId:req.body.quizId });
    }
    else{
        console.log(req.body.assignmentId);
        findSubmission = await getSubmissionById({ student: req.user.id,assignmentId:req.body.assignmentId });
    }
    if(findSubmission){
        return next({
            message: "Submission already exist",
            statusCode: STATUS_CODES.BAD_REQUEST,
        });
    }

    
  if (req?.files?.pdf?.length > 0) {
    let imageURL = await uploadOnCloudinary(req?.files?.pdf[0].path);
    if (!imageURL) {
      return next({
        message: "Image failed why uploading on cloudinary",
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
    }
    req.body.pdf = imageURL.secure_url;
  } 
    req.body.status = 'Submitted';
    const submission = await createSubmission(req.body);

    const userPoints = await getPoints({ user: req.user.id });
    if(req.body.isQuiz){
        userPoints.quiz += 10;        
    }else{
        userPoints.assignment += 10;
    }

    await userPoints.save();
    await createPointsLog({userId:req.user.id,title:req.body.isQuiz == true ? 'Quiz Submission' : 'Assignment Submission',points:10});
    generateResponse(submission, "Submission created successfully", res);
});


export const getSubmissions = asyncHandler(async (req, res, next) => {
    const user = await getUser({ _id: req.user.id });
    const quiz = req.query.isQuiz == 'true' ? true : false;
    const id = req.query.id || null;
    const subject = req.query.subject 
    
    let submission
    if(user.role === 'teacher'){
        submission = await getSubmission({ teacher: req.user.id, isQuiz: quiz, $or: [
            { assignmentId: id },
            { quizId: id }
        ]}).populate('quizId').populate('assignmentId').populate('student');
        console.log(submission)
        console.log("if statement run")
    }
    else{
        // console.log("body: ", req.body)
        console.log("query: ",req.query)
        // console.log(quiz);
        console.log(req.user.id);
        submission = await getSubmission({ student: req.user.id,isQuiz:quiz,subject:subject })
        console.log(submission);
    }

    generateResponse(submission, "Submission fetched successfully", res);
})

export const getStudentSubmission = asyncHandler(async (req, res, next) => {
    const submission = await getSubmission({ student: req.user.id });
    generateResponse(submission, "Submission fetched successfully", res);
})

export const fetchSubmissionById = asyncHandler(async (req, res, next) => {
    const submission = await getSubmission({ _id: req.params.id });
    generateResponse(submission, "Submission fetched successfully", res);
})

export const updateSubmission = asyncHandler(async (req, res, next) => {

    const {grade} = req.body;
    const submission = await getSubmissionById({ _id: req.params.id });
    if (!submission) {
        return next({
            message: "Submission not found",
            statusCode: STATUS_CODES.NOT_FOUND,
        });
    }
    
    if(submission.totalMarks < grade){
        return next({
            message: "Grade is greater than total marks",
            statusCode: STATUS_CODES.BAD_REQUEST,
        });
    }

    submission.obtainMarks = grade;
    await submission.save();
    // console.log("==========",submission.obtainMarks);

    generateResponse(submission, "Submission updated successfully", res);

})

export const deleteSubmission = asyncHandler(async (req, res, next) => {
    const deletedSubmission = await deleteSubmissions(req.params.id);
    if(!deletedSubmission){
        return next({
            message: "Submission not found",
            statusCode: STATUS_CODES.NOT_FOUND,
        });
    }
    generateResponse(deletedSubmission, "Submission deleted successfully", res);
})

export const checkStatus = asyncHandler(async (req, res, next) => {
    const submission = await getSubmission({ assignmentId: req.query.assignmentId,student:req.user.id});
    if(submission.length === 0){
       return generateResponse('Pending', "Submission not found", res);
    }

    generateResponse('Submitted', "Submission fetched successfully", res);   
})


export const checkStatusQuiz = asyncHandler(async (req, res, next) => {
    const submission = await getSubmission({ quizId: req.query.quizId,student:req.user.id});
    if(submission.length === 0){
       return generateResponse('Pending', "Submission not found", res);
    }

    generateResponse('Submitted', "Submission fetched successfully", res);   
})

