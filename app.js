import express, { json } from "express";
import cors from "cors";
import usersRouter from "./routes/users-routes.js";
import authRouter from "./routes/auth-routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import imageRouter from "./routes/image-routes.js"
import offersRouter from "./routes/offers-routes.js"
import recommendationsRouter from "./routes/recommendation-routes.js"
import contractsRouter from  "./routes/contracts-routes.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
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

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: '1.0.0',
    },
  },
  apis: ["./routes/auth-routes.js","./routes/users-routes.js" ],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/", express.static(join(__dirname, "public")));
app.use("/api/images", imageRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/offers", offersRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/contracts", contractsRouter);



app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
