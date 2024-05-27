import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Class",
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
   
});

const Subject = mongoose.model('Subject', subjectSchema);

export const createSubject = (obj) => Subject.create(obj);
export const fetchSubject = (query) => Subject.find(query);