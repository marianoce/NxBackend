import { v2 as cloudinary } from 'cloudinary';
let streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export function cloudinaryUpload (file: any, mimetype: string): any {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    let rtype = 'image';
    if (mimetype.indexOf('video') >= 0)
      rtype = 'video';

    let uploadFromBuffer = (input: any) => {
      return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: process.env.CLOUDINARY_CLOUD_FOLDER,
            resource_type: rtype
          },
          (error: any, result: any) => {
    
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
    
        streamifier.createReadStream(input).pipe(cld_upload_stream);
      });
    };

    return uploadFromBuffer(file);
}


export async function cloudinaryDeleteBulk(ids: string[], mimetype: string) {

  let rtype = 'image';
  if (mimetype.indexOf('video') >= 0)
    rtype = 'video';

  await cloudinary.api.delete_resources(ids, { resource_type: rtype }, (result) => {
    console.log(result);
  });
}
