// import { v2 as cloudinary } from "cloudinary";
// import config from "../config/config.js";
// import { Readable } from "stream";

// cloudinary.config({
//   cloud_name: config.CLOUD_NAME,
//   api_key: config.API_KEY,
//   api_secret: config.API_SECRET,
// });

// export const uploadFile = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "Instagram" },
//       (err, fileData) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve({
//           url: fileData.url,
//           asset_id: fileData.asset_id,
//           publicId: fileData.public_id,
//           format: fileData.format,
//         });
//       }
//     );

//     Readable.from(fileBuffer).pipe(uploadStream);
//   });
// };


import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
});

export const uploadFile = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "Instagram" },
      (err, fileData) => {
        if (err) {
          return reject(err);
        }
        resolve({
          url: fileData.secure_url, // ✅ Use secure_url for HTTPS
          publicId: fileData.public_id, // ✅ FIX: camelCase 'publicId' to match your schema
          asset_id: fileData.asset_id,
          format: fileData.format,
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};
