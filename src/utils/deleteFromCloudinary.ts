import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (url: string) => {
    try {
        cloudinary.config({
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        if (!url) {
            return null;
        }
        const splitUrl = url.split("/");
        const filename = splitUrl[splitUrl.length - 1];
        const publicId = filename.split(".")[0];
        if (!publicId) {
            return null;
        }
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (err) {
        return null;
    }
};

export { deleteFromCloudinary };
