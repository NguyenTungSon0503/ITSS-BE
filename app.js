import express, { json } from "express";
import cors from "cors";
import usersRouter from "./routes/users-routes.js";
import authRouter from "./routes/auth-routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import imageRouter from "./routes/image-routes.js"

//change domain to /api/images
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/", express.static(join(__dirname, "public")));
app.use("/api/images", imageRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
