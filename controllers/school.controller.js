import mongoose from 'mongoose';
import { getAllUsers } from '../models/user.model.js';
import { ROLES } from '../utils/constants.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';


export const users = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const search = req.query.search && req.query.search.trim() ? req.query.search.trim() : null;
    const role = req.query.role ? req.query.role : '';

    const pipeline = []
    
    pipeline.push({
       $match:{school: new mongoose.Types.ObjectId(req.user.id)}
    })


    if(role) pipeline.push({$match:{role}});

    // if(search) {
    //     pipeline.push({$match:{email:search}})
    // }
        pipeline.push({
        $lookup:{
            from:'classes',
            localField:'classes',
            foreignField:'_id',
            as:'classes'
        }
    })

    pipeline.push({
        $sort:{
            createdAt:-1
        }
    })
    const users = await getAllUsers({limit, page,query:pipeline});

    generateResponse(users, 'Subjects fetched successfully', res);
})
