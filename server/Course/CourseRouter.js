const { Router } = require("express");
const courseController = require("./CourseController");
const asyncHandler = require("express-async-handler");
const upload = require("../multer");

const courseRouter = Router();

courseRouter.post("/create", upload.array("file"), asyncHandler(courseController.addCourse));
courseRouter.get("/", asyncHandler(courseController.getCourses));
courseRouter.get("/:id", asyncHandler(courseController.getCourseById));
courseRouter.put("/update/:id", asyncHandler(courseController.updateCourse));
courseRouter.delete("/delete/:id", asyncHandler(courseController.deleteCourse));

module.exports = courseRouter;
