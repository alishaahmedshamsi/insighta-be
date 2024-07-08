import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
	quizId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "quiz",
	},
	assignmentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment",
	},
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
	},
	class: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class",
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	question: {
		type: [String],
	},
	answers: {
		type: [String],
	},
	pdf: {
		type: String,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
	isLate: {
		type: Boolean,
		default: false,
	},
	isQuiz: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		default: "pending",
	},
	obtainMarks: {
		type: Number,
		default: 0,
	},
});

// Create QuizSubmission model
const Submission = mongoose.model("Submission", submissionSchema);
export const createSubmission = (obj) => Submission.create(obj);
export const getSubmissionById = (query) => Submission.findOne(query);
export const getSubmission = (query) => Submission.find(query);
export const updateSubmissions = (query, update) =>
	Submission.updateOne(query, update);
export const deleteSubmissions = (id) => Submission.findByIdAndDelete(id);
