const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./db');
const userRouter = require('./Users/UserRouter');
const mediaRouter = require('./Media/MediaRouter');
const path = require('path');
const categoryRouter = require('./Category/CategoryRouter');
const courseRouter = require('./Course/CourseRouter');
const userCourseRouter = require('./UserCourse/UserCourseRouter');

const app = express();

dotenv.config();
connectDb();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/user", userRouter);
app.use("/media", mediaRouter);
app.use("/category", categoryRouter);
app.use("/courses", courseRouter);
app.use("/user-courses", userCourseRouter);


app.get("/", (req, res) => {
    return res.status(200).send({ message: "API is running successfully!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on Port ${process.env.PORT}`);
});
