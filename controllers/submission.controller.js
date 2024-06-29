import { getPoints } from "../models/points.model.js";
import { createSubmission, deleteSubmissions, getSubmission, getSubmissionById, updateSubmissions } from "../models/submission.model.js";
import { getUser } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { STATUS_CODES } from "../utils/constants.js";
import { generateResponse,asyncHandler } from "../utils/helpers.js";

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
    console.log(findSubmission);
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
  
    const submission = await createSubmission(req.body);

    const userPoints = await getPoints({ user: req.user.id });
    if(req.body.isQuiz){
        userPoints.quiz += 20;        
    }else{
        userPoints.assignment += 10;
    }
    await userPoints.save();
    generateResponse(submission, "Submission created successfully", res);
});


export const getSubmissions = asyncHandler(async (req, res, next) => {
    const user = await getUser({ _id: req.user.id });
    const quiz = req.query.isQuiz || true;
    let submission
    if(user.role === 'teacher'){
        submission = await getSubmission({ teacher: req.user.id,isQuiz:quiz });
    }
    else{
        submission = await getSubmission({ student: req.user.id,isQuiz:quiz });
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
    const submission = await getSubmission({ _id: req.params.id });
    if (!submission) {
        return next({
            message: "Submission not found",
            statusCode: STATUS_CODES.NOT_FOUND,
        });
    }
    const updatedSubmission = await updateSubmissions(req.body);
    generateResponse(updatedSubmission, "Submission updated successfully", res);
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



