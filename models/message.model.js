import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
});

const Message = mongoose.model('Message', messageSchema);

export const sendMessage = (data) => Message.create(data);
export const findMessage = (query) => Message.find(query);
