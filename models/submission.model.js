const mongoose = require('mongoose');

// Define QuizSubmission schema
const quizSubmissionSchema = new mongoose.Schema({
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
        ref: 'Student',
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
    }
    
});

// Define AssignmentSubmission schema
const assignmentSubmissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Create QuizSubmission model
const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);

// Create AssignmentSubmission model
const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

module.exports = {
    QuizSubmission,
    AssignmentSubmission
};