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
        ref: 'user',
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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