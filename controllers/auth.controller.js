import { generateResponse, asyncHandler, generateOTP } from '../utils/helpers.js';
import { createPoints, createUser, getUser } from '../models/index.js';
import { ROLES, STATUS_CODES } from '../utils/constants.js';
import { fetchSubject, findSubject } from '../models/subject.model.js';

// register user
export const register = asyncHandler(async (req, res, next) => {
    
    // create user in db
    if(req.body.role != ROLES.SCHOOL) req.body.school = req.user.id


    if(req.body.role == ROLES.STUDENT){
        const findSubjects = await fetchSubject({class:req.body.classes[0]})
        console.log(findSubjects);
        req.body.subject = findSubjects.map(subject => subject._id)
    }
    let user = await createUser(req.body);
    await createPoints({user:user._id})
    
    // remove password
    user = user.toObject();
    delete user.password;
    generateResponse(user, "Register successful", res);
});

// login user
export const login = asyncHandler(async (req, res, next) => {
    let user = await getUser({ email: req.body.email }).select('+password');

    if (!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email or password'
    });

    const isPasswordMatch = await user.isPasswordCorrect(req.body.password);

    if (!isPasswordMatch) return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: 'Invalid password'
    });

    const accessToken = await user.generateAccessToken();
    req.session = { accessToken };

    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse({ user, accessToken }, 'Login successful', res);
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
   const {email} = req.body

    const user = await getUser({ email });
    
    if (!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'User not found'
    });

    const otp = generateOTP();
    user.otp = otp;
    user.save();
   generateResponse(otp, 'otp sent to your email', res);
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
    
    const user = await getUser({email:req.body.email}).select('+otp').select('+otpExpiry')
    const {otp} = req.body

    if (!user) return next({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: 'User not found'
    });

    if(parseInt(user.otp) != parseInt(otp)){
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'Invalid OTP'
        });
    }

    if(user.otpExpiry < new Date()){
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'OTP has expired'
        });
    }

    const accessToken = user.generateAccessToken();
    generateResponse(accessToken, 'OTP verified successfully', res);
})

export const resetPassword = asyncHandler(async (req, res, next) => {
    
    const userId = req.user.id 
    const user = await getUser({_id:userId}).select('+password')

    const {password} = req.body

    if (!user) return next({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: 'User not found'
    });

    user.password = password;
    await user.save();

    generateResponse(null, 'Password reset successful', res);
})

export const currentUser = asyncHandler(async (req, res, next) => {
  
    const user = await getUser({_id:req.user.id}).lean().populate('classes').populate('subject');  
    generateResponse(user, 'User details', res);
})

export const logout = asyncHandler(async (req, res, next) => {
    req.session = null;
    generateResponse(null, 'Logout successful', res);
});

