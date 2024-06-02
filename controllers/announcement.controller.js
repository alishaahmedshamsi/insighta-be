import { createAnnouncement, getAnnouncements } from '../models/announcement.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const createAnnouncements = asyncHandler(async (req, res, next) => {

    req.body.createdBy = req.user.id;
    const response = await createAnnouncement(req.body);
    console.log(response);
    generateResponse(response, 'Announcement created successfully', res);
});

export const fetchAnnouncements = asyncHandler(async (req, res, next) => {
   const createdBy = req.query.createdBy;
   if(!createdBy) return generateResponse(null, 'Please provide createdBy', res, 400);

    const response = await getAnnouncements({ createdBy }).sort({ createdAt: -1 }) ;
   console.log(response);
    generateResponse(response, 'Announcements fetched successfully', res);
});