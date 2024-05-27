import mongoose from 'mongoose';
import { getAllUsers } from '../models/user.model.js';
import { ROLES } from '../utils/constants.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

export const findSchoolsInfomation = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const schoolId = req.query.schoolId ? req.query.schoolId : null;

    const pipeline = [
        {
            $match: { role: ROLES.SCHOOL }
        },
        {
            $lookup: {
                from: 'users', // The collection name in MongoDB
                localField: '_id',
                foreignField: 'school',
                as: 'members'
            }
        },
        
        {
            $project: {
                _id: 1,
                fullname: 1,
                email: 1,
                
                studentCount: {
                    $size: {
                        $filter: {
                            input: '$members',
                            as: 'member',
                            cond: { $eq: ['$$member.role', 'student'] }
                        }
                    }
                },
                teacherCount: {
                    $size: {
                        $filter: {
                            input: '$members',
                            as: 'member',
                            cond: { $eq: ['$$member.role', 'teacher'] }
                        }
                    }
                }
            }
        },
    ]

    if(schoolId) {
        pipeline.push({
            $match: { _id: new mongoose.Types.ObjectId(schoolId) }
        })
    }
    
    const data = await getAllUsers({limit,page,query:pipeline});
    generateResponse(data, "Schools information fetched successfully", res);
})