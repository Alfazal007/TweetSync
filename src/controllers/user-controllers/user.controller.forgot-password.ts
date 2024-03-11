import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/prisma";
import { emailType, usernameType } from "../../utils/ZodValidators";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateHashPassword } from "../../utils/hashPassword";
import { ApiResponse } from "../../utils/ApiResponse";
import { sendMail } from "../../utils/sendMail";

const forgotPasswordGenerateLink = asyncHandler(
    async (req: Request, res: Response) => {
        const userData = req.body;
        let userInfo;
        if (userData.email) {
            const { success } = emailType.safeParse(userData.email);
            if (!success) {
                return res
                    .status(401)
                    .json(new ApiError(401, "Invalid user inputs", []));
            }
            userInfo = userData.email;
        } else if (userData.username) {
            const { success } = usernameType.safeParse(userData.username);
            if (!success) {
                return res
                    .status(401)
                    .json(new ApiError(401, "Invalid user inputs", []));
            }
            userInfo = userData.username;
        } else {
            return res
                .status(401)
                .json(new ApiError(401, "Invalid user inputs", []));
        }
        const userFromDb = await prisma.user.findFirst({
            where: {
                OR: [{ username: userInfo }, { email: userInfo }],
            },
        });
        if (!userFromDb) {
            return res
                .status(401)
                .json(new ApiError(401, "Invalid user inputs", []));
        }
        const newSecret = process.env.ACCESSTOKENSECRET + userFromDb.password;
        const token = jwt.sign(
            {
                id: userFromDb.id,
                email: userFromDb.email,
                username: userFromDb.username,
            },
            newSecret,
            {
                expiresIn: "15m",
            }
        );
        const link = `http://127.0.0.1:8000/api/v1/users/new-password/${userFromDb.id}/${token}`;
        try {
            const emailSent = await sendMail(userFromDb.email, link);
        } catch (err) {
            return res
                .status(500)
                .json(
                    new ApiError(500, "There was an error try again later", [])
                );
        }
        // TODO : send the link via email
        return res.status(200).json(
            new ApiResponse(200, "Email sent", {
                message:
                    "Check email for a one time usable link to change password. Use it within 15 minutes",
            })
        );
    }
);
const handleResetToken = asyncHandler(async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    const userData = req.body;
    if (!userData || !userData.newPassword || userData.newPassword.length < 6) {
        return res
            .status(401)
            .json(new ApiError(401, "Provide valid password to update", []));
    }
    const userFromDb = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!userFromDb) {
        return res
            .status(401)
            .json(new ApiError(401, "No corresponding user found", []));
    }
    const newSecret = process.env.ACCESSTOKENSECRET + userFromDb.password;
    let userInfo;
    try {
        userInfo = jwt.verify(token, newSecret || "") as JwtPayload;
    } catch (error) {
        if (!userInfo) {
            return res
                .status(403)
                .json(new ApiError(403, "Forbidden request! Try again later"));
        }
    }
    const userFromToken = await prisma.user.findFirst({
        where: {
            id: userInfo.id,
        },
    });
    if ((userFromToken?.id || "") != userFromDb.id) {
        return res
            .status(403)
            .json(
                new ApiError(
                    403,
                    "Forbidden request user thing! Try again later"
                )
            );
    }
    try {
        const hashedPassword = await generateHashPassword(userData.newPassword);
        await prisma.user.update({
            where: {
                id: userFromToken?.id,
            },
            data: {
                password: hashedPassword,
                refreshToken: "",
            },
        });
    } catch (error) {
        return res
            .status(403)
            .json(new ApiError(403, "Something went wrong! Try again later"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Password update successful! Relogin", {}));
});

export { forgotPasswordGenerateLink, handleResetToken };
