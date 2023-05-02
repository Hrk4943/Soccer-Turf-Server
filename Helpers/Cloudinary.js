import { v2 as cloudinary  } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({
    cloud_name:"duf4yrgth",
    api_key:"137175459263985",
    api_secret: "tplE197AlJnq90PKiNPiGX0rDls"
})
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };
  
  const uploadImage = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      });
    });
  };
  
  export default (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      });
    });
  };
  
  export const uploadMultipleImages = (images) => {
    return new Promise((resolve, reject) => {
      const uploads = images.map((base) => uploadImage(base));
      Promise.all(uploads)
        .then((values) => resolve(values))
        .catch((err) => reject(err));
    });
  };

