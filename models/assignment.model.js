import mongoose  from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    assignmentFile:{
        type: String,
    },
    deadline: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    class:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    },
    isDelated:{
        type: Boolean,
        default: false
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export const createAssignment =  (data) => Assignment.create(data);
export const getAssignments =  (query) => Assignment.find(query);
export const getAssignment =  (query) => Assignment.findOne(query);