import { getAssignments } from "../models/assignment.model.js";
import { getLectures } from "../models/lecture.model.js";
import { findQuizzes } from "../models/quiz.model.js";
import { getUser } from "../models/user.model.js";
import { STATUS_CODES } from "../utils/constants.js";
import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    
    console.log(user.school);
    // const findUserSchool = await getUser({ school:id });

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

  
  // Analyze the AI response
  let reviewStatus;
  let points = 0;

  if (responseText.toLowerCase() === "good") {
    reviewStatus = "Good";
    points = 10; // Example points to add
  } else if (responseText.toLowerCase() === "bad") {
    reviewStatus = "Bad";
    points = -5; // Example points to deduct
  } else if (responseText.toLowerCase() === "really bad") {
    reviewStatus = "Really Bad";
    points = -10; // Example points to deduct
  } 

  generateResponse(
    { reviewStatus, points },
    "Review submitted and analyzed successfully",
    res
  );
});
