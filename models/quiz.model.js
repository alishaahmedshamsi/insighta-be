import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        },
        question: [{
            type: String,
        }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    class:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    },
    deadline:{
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    marks:{
        type:Number,
        default:10
    }
});

const QuizModel = mongoose.model('quiz', quizSchema);

export const createQuiz = (obj) => QuizModel.create(obj);
export const findQuiz = (query) => QuizModel.findOne(query);
export const updateQuiz = (query,update) => QuizModel.QuizModel.findOneAndUpdate(query,update,{new:true});
export const findQuizzes = (query) => QuizModel.find(query);