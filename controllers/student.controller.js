import { getAssignments } from "../models/assignment.model.js";
import { getLectures } from "../models/lecture.model.js";
import { getPoints } from "../models/points.model.js";
import { findQuizzes } from "../models/quiz.model.js";
import { createReview, findSIngleReview, getReview } from "../models/review.model.js";
import { getUser } from "../models/user.model.js";
import { STATUS_CODES } from "../utils/constants.js";
import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createPointsLog } from "../models/pointsLog.model.js";
export const fetchStudentsQuiz = asyncHandler(async (req, res) => {
  if (req.query.subject === undefined) {
    return next({
      message: "Subject is required",
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }

  const quiz = await findQuizzes({ subject: req.query.subject });
  generateResponse(quiz, "Students fetched successfully", res);
});

export const fetchStudentAssignment = asyncHandler(async (req, res) => {
  if (req.query.subject === undefined) {
    return next({
      message: "Subject is required",
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }

  const quiz = await getAssignments({ subject: req.query.subject });
  generateResponse(quiz, "Students fetched successfully", res);
});

export const fetchStudentLecture = asyncHandler(async (req, res, next) => {
  if (req.query.subject === undefined) {
    return next({
      message: "Subject is required",
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }

  const quiz = await getLectures({ subject: req.query.subject });
  generateResponse(quiz, "Students lecture fetched successfully", res);
});

export const submitReview = asyncHandler(async (req, res, next) => {

    const user = await getUser({ _id: req.user.id }).populate("school");
    

    if(user.school && user.school.isReviewOpen === false){
        return next({
            message: "Review is closed",
            statusCode: STATUS_CODES.BAD_REQUEST,
    });
}

    const genAI = new GoogleGenerativeAI(
    "AIzaSyAnXj29JWgGX_RkCXk9WpctaU89TLcdG-A"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { text, teacherId } = req.body;

  // Generate AI response
  let review = `Analyze the following review and respond with only one word: Good, Bad, or Really Bad.\n\nReview: "${text}"`
  const aiResponse = await model.generateContent(review);

  const responseText = aiResponse.response.text().trim();
  console.log(responseText);

  let reviewStatus;
  let points = 0;

  if (responseText.toLowerCase() === "good") {
    reviewStatus = "Good";
    points = 5; 
  } else if (responseText.toLowerCase() === "bad") {
    reviewStatus = "Bad";
    points = -5; 
  } else if (responseText.toLowerCase() === "really bad") {
    reviewStatus = "Really Bad";
    points = -10; 
  } 

  const findTeacherPoints = await getPoints({ user: teacherId });

  if(reviewStatus === "Good"){
    findTeacherPoints.review += 10;
  }
  else if(reviewStatus === "Bad"){
    findTeacherPoints.review -= 5;
  }
  else if(reviewStatus === "Really Bad"){
    findTeacherPoints.review -= 10;
  }

  await findTeacherPoints.save();
  await createPointsLog({ userId: teacherId, title: "Review", points });
  
  const reviews = createReview({
    studentId: req.user.id,
    teacherId,
    review: text,
    status: "Submitted",
  })

  generateResponse(
    { reviews },
    "Review submitted and analyzed successfully",
    res
  );
});

export const lecturePoints = asyncHandler(async (req, res, next) => {
  const findPoints = await getPoints({ user: req.user.id });

  findPoints.lecture += 10;
  await findPoints.save();
  await createPointsLog({ userId: req.user.id, title: "Lecture", points: 10 });
  console.log(findPoints);
  generateResponse(
    { lectureId, points },
    "Lecture points submitted successfully",
    res
  );
})

export const findReviewIfExist =  async ()  => {
  const review = await findSIngleReview({ studentId: req.user.id,teacherId: req.query.teacherId});
  return review
};