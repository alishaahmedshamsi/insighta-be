// models/groupChat.js
import mongoose from 'mongoose';


const ChatSchema = new mongoose.Schema({
    status: { type:String, default: 'active' },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
}, { timestamps: true, versionKey: false });


const ChatModel =  mongoose.model('Chat', ChatSchema);

export const createChat = (data) => ChatModel.create(data);
