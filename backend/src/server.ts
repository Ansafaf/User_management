import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import AuthRouter from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is runnning"
  });
});

const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`)
    );
  })
  .catch((err) => console.log("Server has an issue: ", err));
