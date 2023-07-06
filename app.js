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
import reviewRouter from "./routes/review-routes.js"
import http from "http";
import {Server, Socket} from 'socket.io';
import { createServer } from 'http';
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
app.use("/api/review", reviewRouter);



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => { ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id); 
  socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    io.emit("sendDataServer", {data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

io.listen(5001)
server.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
