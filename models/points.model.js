import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    quiz: {
        type: Number,
        default: 0
    },
    assignment: {
        type:Number,
        default: 0        
    },
    review:{
        type: Number,
        default: 0
    },
    lecture:{
        type:Number,
        default: 0
    },
    total:{
        type:Number,
        default: 0
    }
});


const Points = mongoose.model('points', pointsSchema);

export const createPoints = (obj) => Points.create(obj);
export const getPoints = (query) => Points.findOne(query);

export const getAllPoints = async ({ query, page, limit }) => {
    const { data, pagination } = await getPaginatedData({
        model: Points,
        query,
        page,
        limit
    });
    return { data, pagination };
}

export const updatePoints = (query,update) => Points.updateOne(query,update);
