import multer from 'multer';
require('dotenv').config()
import cloudinary from 'cloudinary'
import streamifier from 'streamifier'

cloudinary.v2.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_KEY,
   api_secret: process.env.CLOUDINARY_SECRET
});

let streamUpload = (req) => {
   return new Promise((resolve, reject) => {
      let stream = cloudinary.v2.uploader.upload_stream(
         {
            folder: "QuizApp"
         },
         (error, result) => {
            if (result) {
               resolve(result);
            } else {
               reject(error);
            }
         }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
   });
};

async function uploadCloud(req) {
   let result = await streamUpload(req);
   return result
}

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      // cb('invalid image file!', false);
      req.fileValidationError = "Forbidden extension";
      cb(null, false, req.fileValidationError)
   }

};
const uploads = multer({ storage, fileFilter });
export { uploads, uploadCloud, cloudinary } 