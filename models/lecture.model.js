import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    lecture:{
        type: String,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    class:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    },
},{timestamps:true});

const Lecture = mongoose.model('Lecture', lectureSchema);

export const createLecture = (obj) => Lecture.create(obj);
export const getLectures = (query) => Lecture.find(query);
export const getLecture = (query) => Lecture.findOne(query).populate('teacher').populate('class').populate('subject');
