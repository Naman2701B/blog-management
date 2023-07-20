const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const {
    errorResponseHandler,
    invalidPathHandler,
} = require("./middleware/errorHandler");
const path = require("path");

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is up and listening on port " + PORT);
});