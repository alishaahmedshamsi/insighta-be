import mongoose from "mongoose";

const pointsLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
    },
    points: {
        type: Number,
    },
},{timestamps: true});

const PointsLog = mongoose.model('PointLog', pointsLogSchema);

export const createPointsLog = (obj) => PointsLog.create(obj);
export const findOnePontsLog = (query) => PointsLog.findOne(query);
export const findUserPointsLog = (query) => PointsLog.find(query);
