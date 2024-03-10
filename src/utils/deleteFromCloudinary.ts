import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const deleteFromCloudinary = async (url: string) => {
    try {
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
