import { getUser, getAllUsers, getPoints } from "../models/index.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ROLES, STATUS_CODES } from "../utils/constants.js";
import { asyncHandler, generateResponse } from "../utils/helpers.js";

// get all users
export const fetchAllUsers = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || "";

  // also exclude current login user from the list
  const filters = [
    { role: { $ne: ROLES.ADMIN } },
    { _id: { $ne: req.user.id } },
    { email: { $regex: search, $options: "i" } },
  ];
  const query = { $and: filters };

  const usersData = await getAllUsers({ query, page, limit });
  generateResponse(
    usersData,
    usersData?.data?.length > 0 ? "List fetched successfully" : "No user found",
    res
  );
});

// get current user
export const fetchUser = asyncHandler(async (req, res, next) => {
  const user = await getUser({ _id: req.params.userId }).populate("classes").populate("subject");
  
  if (!user)
    return next({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "User not found",
    });
  generateResponse(user, "User fetched successfully", res);
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await getUser({ _id: req.user.id });

  if (req?.files?.image?.length > 0) {
    let imageURL = await uploadOnCloudinary(req?.files?.image[0].path);
    if (!imageURL) {
      return next({
        message: "Image failed why uploading on cloudinary",
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
    }
    console.log(imageURL.secure_url);
    req.body.profilePicture = imageURL.secure_url;
  }
  const updatedUser = await user.updateOne(req.body);
  generateResponse(updatedUser, "User updated successfully", res);
});

export const getUserPoints = asyncHandler(async (req, res, next) => {
  const userPoints = await getPoints({ user: req.user.id });
  userPoints.total =
    userPoints.quiz +
    userPoints.assignment +
    userPoints.review +
    userPoints.lecture;
  await userPoints.save();
  generateResponse(userPoints, "Points fetched successfully", res);
});

export const userSubject = asyncHandler(async (req, res, next) => {
  const user = await getUser({ _id: req.user.id }).populate("subject");
  const subject = user.subject;
  generateResponse(subject, "User fetched successfully", res);
})