import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className: {
        type: Number,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Class = mongoose.model('Class', classSchema);

export const createClass = (obj) => Class.create(obj);
export const getClass = (query) => Class.find(query);

