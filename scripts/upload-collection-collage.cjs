require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
cloudinary.uploader
  .upload("public/images/woodloom-collection-collage-v1.png", {
    folder: "woodloom/site",
    public_id: "collection-collage-v1",
    overwrite: true,
    resource_type: "image",
  })
  .then((r) => console.log(r.secure_url))
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
