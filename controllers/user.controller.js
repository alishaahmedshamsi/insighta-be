import { getUser, getAllUsers } from "../models/index.js";
import { ROLES, STATUS_CODES } from "../utils/constants.js";
import { asyncHandler, generateResponse } from '../utils/helpers.js';

// get all users
export const fetchAllUsers = asyncHandler(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const search = req.query.search || '';

    // also exclude current login user from the list
    const filters = [
        { role: { $ne: ROLES.ADMIN } },
        { _id: { $ne: req.user.id } },
        { email: { $regex: search, $options: 'i' } }
    ];
    const query = { $and: filters };

    const usersData = await getAllUsers({ query, page, limit });
    generateResponse(usersData, usersData?.data?.length > 0 ? 'List fetched successfully' : 'No user found', res);
});

// get current user
export const fetchUser = asyncHandler(async (req, res, next) => {
    const user = await getUser({ _id: req.params.userId }).lean();
    if (!user) return next({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: 'User not found'
    });

    generateResponse(user, 'User fetched successfully', res);
});

export const updateUser = asyncHandler(async (req, res, next) => {
   
    if (req?.files?.image?.length > 0) {
        let imageURL = await uploadOnCloudinary(req.files.image[0].path);
    
        if (!imageURL) {
          return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: "Image failed why uploading on cloudinary",
          });
        }
    
        req.body.profilePicture = imageURL.secure_url;
      }

    const updatedUser = await user.updateOne(req.body);
    generateResponse(updatedUser, 'User updated successfully', res);
});