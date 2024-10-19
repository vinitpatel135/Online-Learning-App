const { Router } = require("express");
const userCourseController = require("./UserCourseController");
const asyncHandler = require("express-async-handler");

const userCourseRouter = Router();

userCourseRouter.post("/user-enroll", asyncHandler(userCourseController.enrollUserInCourse));
userCourseRouter.post("/update-completed-video", asyncHandler(userCourseController.updateCompletedVideo));
userCourseRouter.get("/user-courses/:id", asyncHandler(userCourseController.getUserCourses));
userCourseRouter.post("/getUserCoursesDetails", asyncHandler(userCourseController.getUserCoursesDetails));
userCourseRouter.delete("/remove-user-course", asyncHandler(userCourseController.removeUserFromCourse));

module.exports = userCourseRouter;
