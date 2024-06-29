import mongoose from "mongoose";

// Define QuizSubmission schema
const submissionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quiz',
    },
    assignmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assignment',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    question:{
        type: [String],
    },
    answers: {
        type: [String],
    },
    pdf:{
        type:String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    isLate:{
        type: Boolean,
        default: false
    },
    isQuiz:{
        type: Boolean,
        default: false
    }
});


// Create QuizSubmission model
const Submission = mongoose.model('Submission', submissionSchema);
export const createSubmission = (obj) => Submission.create(obj)
export const getSubmissionById = (query) => Submission.findOne(query)
export const getSubmission = (query) => Submission.find(query) 
export const updateSubmissions = (query,update) => Submission.updateOne(query,update)
export const deleteSubmissions = (id) => Submission.findByIdAndDelete(id)