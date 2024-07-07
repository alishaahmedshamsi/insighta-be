import mongoose from 'mongoose';
import { getAllUsers, getUser } from '../models/user.model.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';


export const users = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const search = req.query.search ? req.query.search.trim() : '';
    const role = req.query.role ? req.query.role : '';

    const pipeline = []

    if (search) {
        const searchRegex = new RegExp(search, 'i'); 
        pipeline.push({
            $match: {
                     email: { $regex: searchRegex } ,
            }
        });
    }
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

export const fetchTop5Users = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const queryTeachers = [
        {
            $match: {
                school: new mongoose.Types.ObjectId(req.user.id),
                role: 'teacher' // Assuming the role field distinguishes between teachers and students
            }
        },
        {
            $lookup: {
                from: 'points',
                localField: '_id',
                foreignField: 'user',
                as: 'points'
            }
        },
        {
            $unwind: '$points'
        },
        {
            $sort: { 'points.total': -1 }
        },
        {
            $limit: 5
        }
    ];

    const queryStudents = [
        {
            $match: {
                school: new mongoose.Types.ObjectId(req.user.id),
                role: 'student' // Assuming the role field distinguishes between teachers and students
            }
        },
        {
            $lookup: {
                from: 'points',
                localField: '_id',
                foreignField: 'user',
                as: 'points'
            }
        },
        {
            $unwind: '$points'
        },
        {
            $sort: { 'points.total': -1 }
        },
        {
            $limit: 5
        }
    ];

    const [topTeachers, topStudents] = await Promise.all([
        getAllUsers({ limit, page, query: queryTeachers }),
        getAllUsers({ limit, page, query: queryStudents })
    ]);

    const result = {
        topTeachers: topTeachers.data,
        topStudents: topStudents.data,
    };

    generateResponse(result, 'Top 5 teachers and top 5 students fetched successfully', res);
});

export const  updateIsReviewOpen = asyncHandler(async (req, res, next) => {
    const { isReviewOpen } = req.body;
    const user = await getUser({ _id: req.user.id });
    console.log(req.body);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }
    console.log("User");
    user.isReviewOpen = isReviewOpen;
    await user.save();

    generateResponse({}, 'Review status updated successfully', res);
});

export const updateDisplayPoints = asyncHandler(async (req, res, next) => {
    const { displayPoints } = req.body;
    console.log(displayPoints);
    const user = await getUser({ _id: req.user.id });

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    user.displayPoints = displayPoints;
    await user.save();

    generateResponse(user, 'Display points status updated successfully', res);
});

export const fetchGloabalTop5Users = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const queryTeachers = [
        {
            $lookup: {
                from: 'users', // Assuming 'users' collection contains school data
                localField: 'school',
                foreignField: '_id',
                as: 'schoolData'
            }
        },
        {
            $unwind: '$schoolData'
        },
        {
            $match: {
                'schoolData.displayPoints': true,
                role: 'teacher' // Assuming the role field distinguishes between teachers and students
            }
        },
        {
            $lookup: {
                from: 'points',
                localField: '_id',
                foreignField: 'user',
                as: 'points'
            }
        },
        {
            $unwind: '$points'
        },
        {
            $sort: { 'points.total': -1 }
        },
        {
            $project: {
                _id: 1,
                fullname: 1, 
                email: 1,
                profilePicture:1,
                school: '$schoolData.fullname', // Assuming name is a field in the users collection
                points: 1
            }
        },
        {
            $limit: limit
        }
    ];

    const queryStudents = [
        {
            $lookup: {
                from: 'users', // Assuming 'users' collection contains school data
                localField: 'school',
                foreignField: '_id',
                as: 'schoolData'
            }
        },
        {
            $unwind: '$schoolData'
        },
        {
            $match: {
                'schoolData.displayPoints': true,
                role: 'student' 
            }
        },
        {
            $lookup: {
                from: 'points',
                localField: '_id',
                foreignField: 'user',
                as: 'points'
            }
        },
        {
            $unwind: '$points'
        },
        {
            $sort: { 'points.total': -1 }
        },
        {
            $project: {
                _id: 1,
                fullname: 1,
                email: 1,
                profilePicture:1,
                school: '$schoolData.fullname', // Assuming name is a field in the users collection
                points:1,
                
            }
        },
        {
            $limit: limit
        }
    ];

    const [topTeachers, topStudents] = await Promise.all([
        getAllUsers({ limit, page, query: queryTeachers }),
        getAllUsers({ limit, page, query: queryStudents })
    ]);

    const result = {
        topTeachers: topTeachers.data,
        topStudents: topStudents.data,
    };

    generateResponse(result, 'Top 5 teachers and top 5 students fetched successfully', res);
});