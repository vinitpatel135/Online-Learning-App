const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const categoryController = require("./CategoryController");

const categoryRouter = Router();

categoryRouter.post("/create", asyncHandler(categoryController.addCategory));

categoryRouter.get("/", asyncHandler(categoryController.listCategory));

module.exports = categoryRouter;
