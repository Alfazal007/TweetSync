import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";

const unfollow = asyncHandler(async (req: Request, res: Response) => {
    const userRequester = req.user.id;
    // check if not following already
    // if following then unfollow -- delete the relationship from the database
});
export { unfollow };
