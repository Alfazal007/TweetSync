import { startServer } from "./app";
import { configDotenv } from "dotenv";

configDotenv({ path: ".env" });

startServer();
