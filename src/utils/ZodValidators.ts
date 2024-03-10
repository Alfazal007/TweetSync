import z from "zod";

const registerUserSchema = z.object({
    fullName: z.string().min(4),
    username: z.string().min(4),
    email: z.string().email(),
    profilePic: z.string().optional(),
    banner: z.string().optional(),
    refreshToken: z.string().optional(),
    password: z.string().min(6),
    bio: z.string().min(5),
    isVerified: z.boolean(),
});

export { registerUserSchema };
