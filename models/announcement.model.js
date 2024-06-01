import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
   
    content: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true});

const Announcement = mongoose.model('Announcement', announcementSchema);

export const createAnnouncement =  (data) => Announcement.create(data);
export const getAnnouncements =  (query) => Announcement.find(query);
