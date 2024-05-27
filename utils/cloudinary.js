import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';          

cloudinary.config({ 
  cloud_name: 'dh0kktlun', 
  api_key: '478754265662587', 
  api_secret: 'eVqHh4EAFi82_YQNA81zgEGcfHc' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        console.log(response.url);
        return response;
    } catch (error) {
        console.log('Error in file upload:', error);
        fs.unlinkSync(localFilePath);
        throw error; 
    }
};

export default  uploadOnCloudinary;