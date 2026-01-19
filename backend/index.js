import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(morgan("dev"));

//connect to mongodb
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`BD Server Connect Successfully !`);
  })
  .catch((err) => {
    console.log(`DB Server Connection Failed: ${err.message}`);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});

//routes
app.use("/api-v1", routes);

//error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: `Internal Server Error - ${err.message}` });
});

//not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.listen(PORT, () => {
  console.log(`App running at port ${PORT}`);
});
