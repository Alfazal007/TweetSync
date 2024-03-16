import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
); // form-data-limit

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
); // the middleware for reading url params in different browsers

app.use(express.static("public")); // static files which anyone can access
app.use(cookieParser()); // get cookies from browser and also to set it

import { userRouter } from "./routes/user.routes";
app.use("/api/v1/users", userRouter);

import { followRouter } from "./routes/following.routes";
app.use("/api/v1/following", followRouter);

import { tweetsRouter } from "./routes/tweets.routes";
app.use("/api/v1/tweets", tweetsRouter);

import { likeTweetRouter } from "./routes/likes.routes";
app.use("/api/v1/like-tweet", likeTweetRouter);

export { app };
