import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
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
module.exports = Lecture;