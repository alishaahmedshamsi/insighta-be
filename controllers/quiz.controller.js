import { createQuiz, findQuizzes } from '../models/quiz.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

// create quiz
export const makeQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await createQuiz(req.body);
    generateResponse(quiz, 'Quiz created successfully', res);
});


// fetch single quiz from db
export const fetchQuiz = asyncHandler(async (req, res, next) => {
        const quiz = await getQuiz(req.params.id);
        generateResponse(quiz, 'Quiz fetched successfully', res);
    });


// fetch all quiz
export const fetchQuizzes = asyncHandler(async (req, res, next) => {
    const classes = req.query.class;
    const section = req.query.section;
    const quizzes = await findQuizzes({classes,section});
    generateResponse(quizzes, 'Quizzes fetched successfully', res);
});

// update quiz when user submit answers;

export const updateQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await updateQuiz(req.params.id, req.body);
    generateResponse(quiz, 'Quiz updated successfully', res);
});
