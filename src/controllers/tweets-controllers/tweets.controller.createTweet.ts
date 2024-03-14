import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { tweetCreateSchema } from "../../utils/ZodValidators";
import { ApiError } from "../../utils/ApiError";
import { uploadOnCloudinary } from "../../utils/uploadToCloudinary";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary";

const createTweet = asyncHandler(async (req: Request, res: Response) => {
    const tweetToBeUploaded = req.body;
    const validation = tweetCreateSchema.safeParse({
        content: tweetToBeUploaded.content,
        media: tweetToBeUploaded.media || "",
        authorId: req.user.id,
    });
    if (!validation.success) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid tweet format" + validation.error, [])
            );
    }
    const mediaLocalPath = req.file?.path;
    let media;
    if (mediaLocalPath) {
        media = await uploadOnCloudinary(mediaLocalPath);
        tweetToBeUploaded.media = media?.url || "";
    }
    let createdTweet;
    try {
        createdTweet = await prisma.tweet.create({
            data: {
                content: tweetToBeUploaded.content,
                authorId: req.user.id,
                media: tweetToBeUploaded.media,
            },
        });
    } catch (err) {
        if (tweetToBeUploaded.media) {
            await deleteFromCloudinary(tweetToBeUploaded.media);
        }
        return res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "There was an error while creating the tweet.",
                    []
                )
            );
    }
    return res.status(201).json(
        new ApiResponse(201, "Tweet created successfully", {
            data: createdTweet,
        })
    );
});

export { createTweet };
