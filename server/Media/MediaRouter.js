const { Router } = require("express");
const mediaController = require("./MediaController");
const asyncHandler = require("express-async-handler");
const upload = require("../multer");

const mediaRouter = Router();

mediaRouter.post("/create", upload.array("file", 10) ,asyncHandler(mediaController.createMedia));

mediaRouter.delete("/:id", asyncHandler(mediaController.deleteMedia));

mediaRouter.get("/", asyncHandler(mediaController.listMedia));

module.exports = mediaRouter;
