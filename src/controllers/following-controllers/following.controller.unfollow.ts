import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const unfollow = asyncHandler(async (req: Request, res: Response) => {
    const userRequester = req.user.id;
    const { followingUser } = req.body;
    let followRelation;
    try {
        followRelation = await prisma.following.findFirst({
            where: {
                AND: [
                    { followersId: { equals: userRequester } },
                    { followingId: { equals: followingUser } },
                ],
            },
        });
    } catch (error) {
        return res
            .status(404)
            .json(new ApiError(404, "You dont follow this user", []));
    }
    if (!followRelation) {
        return res
            .status(404)
            .json(new ApiError(404, "You dont follow this user", []));
    }
    await prisma.following.delete({
        where: {
            id: followRelation.id,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, "Unfollowed the user", {}));
});
export { unfollow };
