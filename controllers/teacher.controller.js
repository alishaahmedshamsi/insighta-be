import { createAssignment, getAssignments } from '../models/assignment.model.js';
import { createLecture, getLecture } from '../models/lecture.model.js';
import { createPoints, getPoints } from '../models/points.model.js';
import { createQuiz, findQuizzes } from '../models/quiz.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import { ROLES, STATUS_CODES } from '../utils/constants.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { createChat } from '../models/chat.model.js';
import { getAllUsers } from '../models/user.model.js';
import mongoose from 'mongoose';
import { createPointsLog } from '../models/pointsLog.model.js';

export const teacherCreateAssignment = asyncHandler(async (req, res,next) => {
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
    const chatBoxCreated = await createChat({ assignment: assignment._id });

    const teacher = await getPoints({ user: createdBy });
    teacher.assignment += 10;
    await teacher.save();
    await createPointsLog({userId:createdBy,title:"Assignment created",points:10});
    generateResponse({assignment,chatBoxCreated},"Assignment created successfully",res);
});

export const teacherGetAssignments = asyncHandler(async (req, res) => {
    const subject = req.query.subject;

    console.log("=========",subject,"===========");
    const assignments = await getAssignments({createdBy: req.user.id,subject:subject});
    console.log("assignments"+assignments);
    generateResponse(assignments,"Assignments fetched successfully",res);
});

export const teacherCreateQuiz = asyncHandler(async (req, res) => {
    const createdBy = req.user.id;
    req.body.createdBy = createdBy;
    const quiz = await createQuiz(req.body);
    const teacher = await getPoints({ user: createdBy });
    teacher.quiz += 10;
    await teacher.save();
    await createPointsLog({userId:createdBy,title:"Quiz created",points:10});
    generateResponse(quiz,"Quiz created successfully",res);
});

export const teacherGetQuizzes = asyncHandler(async (req, res,next) => {
    const classroom = req.query.classroom;
    const quizzes = await findQuizzes({ createdBy: req.user.id,class: classroom});
    generateResponse(quizzes,"Quizzes fetched successfully",res);
});

export const createLectures = asyncHandler(async (req, res, next) => {
    const createdBy = req.user.id;
    req.body.teacher = createdBy;

    if (req?.files?.lecture) {
        let lectureFile = await uploadOnCloudinary(req?.files?.lecture[0].path);
        if (!lectureFile) {
            return next({
                message: "Lecture file failed while uploading on Cloudinary",
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }
        
        const mimeType = req?.files?.lecture[0]?.mimetype;
        const videoMimeTypes = ["video/mp4", "video/mpeg", "video/ogg", "video/webm", "video/quicktime"];
        req.body.isVideo = videoMimeTypes.includes(mimeType);
        
        console.log(lectureFile.secure_url);
        req.body.lecture = lectureFile.secure_url;
    } else {
        req.body.isVideo = false;
    }

    const lecture = await createLecture(req.body);
    const teacher = await getPoints({ user: createdBy });
    teacher.lecture += 10;
    await teacher.save();
    await createPointsLog({userId:createdBy,title:"Lecture created",points:10});
    generateResponse(lecture, "Lecture created successfully", res);
});


export const getLectures = asyncHandler(async (req, res,next) => {
    const classroom = req.query.class;
    const lectures = await getLecture({ teacher: req.user.id,class: classroom});
    generateResponse(lectures,"Lectures fetched successfully",res);
});

export const getSingleClassTeachers = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    let classes = req.query.class;

    if (!classes) {
        return next({
            message: "No class specified",
            statusCode: 400,
        });
    }
    const teacherClass = new mongoose.Types.ObjectId(classes);


    const pipeline = [
        {
            $match: {
                role: ROLES.TEACHER,
                classes: { $in: [teacherClass] }
            }
        }
    ];

    pipeline.push({
        $lookup:{
            from:'subjects',
            localField:'subject',
            foreignField:'_id',
            as:'subject'
        }
    })

    const teachers = await getAllUsers({ limit, page, query:pipeline});
    console.log(teachers);
    //  teachers.reviewStatus = await findReviewIfExist();
    
     generateResponse(teachers, "Teachers fetched successfully", res);
});


 const findReviewIfExist =  async (studentId,teacherId)  => {
    const review = await findSIngleReview({ studentId: studentId,teacherId:teacherId});
    return review
  };