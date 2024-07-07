import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    review: {
        type: String,
    },
    status:{
        type: String,
        default: "Pending",
        enum: ["Pending", "Submitted"],
    }
});


const Review = mongoose.model('Review', reviewSchema);
export const createReview = (obj) => Review.create(obj);
export const getReview = (query) => Review.find(query);
export const findSIngleReview = (query) => Review.findOne(query);