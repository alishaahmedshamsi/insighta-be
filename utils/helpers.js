import multer from 'multer';
import fs from 'fs';
import { Types } from 'mongoose';
import moment from 'moment';

// generate response with status code
export const generateResponse = (data, message, res, code = 200) => {
    return res.status(code).json({
        statusCode: code,
        message,
        data,
    });
}

// parse body to object or json (if body is string)
export const parseBody = (body) => {
    let obj;
    if (typeof body === "object") obj = body;
    else obj = JSON.parse(body);
    return obj;
}
// async handler for express routes
export const asyncHandler = (requestHandler) => {
    return (req, res, next) => Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
}

// generate uploaded file name for multer storage
const generateFilename = (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
}

// filter image, docs and pdf files
const filterImageOrDocsOrPDF = (req, file, cb) => {
    if (!file.mimetype.match(/image\/(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF|svg|SVG|bmp|BMP|ico|ICO|tiff|TIFF|psd|PSD|pdf|PDF|doc|DOC|docx|DOCX|xls|XLS|xlsx|XLSX|ppt|PPT|pptx|PPTX)/)) {
        req.fileValidationError = 'Only image, docs and pdf files are allowed!';
        return cb(null, false);
    }
    cb(null, true);
}

// upload file with multer
export const upload = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const path = `uploads/${folderName}/`;
                fs.mkdirSync(path, { recursive: true })
                cb(null, path);
            },

            // By default, multer removes file extensions so let's add them back
            filename: generateFilename
        }),
        limits: { fileSize: 10 * 1024 * 1024 },  // max 10MB //
        fileFilter: filterImageOrDocsOrPDF
    })
}

// get mongo id
export const getMongoId = (id = null) => {
    return new Types.ObjectId(id);

}

export function formatDate(date) {
    return moment(date).format("MM/DD/YYYY");
}

export function generateOTP () {
    return Math.floor(100000 + Math.random() * 900000);
}