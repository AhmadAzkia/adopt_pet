import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.local.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.local.CLOUDINARY_API_KEY,
  api_secret: process.env.local.CLOUDINARY_API_SECRET,
});

export default cloudinary;
