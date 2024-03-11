import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/AsyncHandler";
import { prisma } from "../../../utils/prisma";
import { ApiError } from "../../../utils/ApiError";
import {
    comparePassword,
    generateHashPassword,
} from "../../../utils/hashPassword";
import { ApiResponse } from "../../../utils/ApiResponse";

const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    if (
        !userData.newPassword ||
        userData.newPassword.length < 6 ||
        !userData.oldPassword
    ) {
        return res
            .status(403)
            .json(
                new ApiError(
                    403,
                    "Provide new password with length greater than 6 along with correct old password",
                    []
                )
            );
    }

    const userInDb = await prisma.user.findFirst({
        where: {
            id: req.user.id,
        },
    });
    if (!userInDb) {
        return res.status(403).json(new ApiError(403, "User not found", []));
    }
    const correctOldPassword = await comparePassword(
        userData.oldPassword,
        userInDb.password
    );
    if (!correctOldPassword) {
        return res
            .status(403)
            .json(new ApiError(403, "Provide correct old password", []));
    }
    const updatedPassword = await generateHashPassword(userData.newPassword);
    const updatedUser = await prisma.user.update({
        where: {
            id: userInDb.id,
        },
        data: {
            password: updatedPassword,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully", {}));
});

export { changePassword };
