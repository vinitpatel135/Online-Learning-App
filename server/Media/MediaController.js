const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { httpErrors, httpSuccess } = require("../constents");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const MediaModel = require("./MediaModel");

ffmpeg.setFfmpegPath(ffmpegPath);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, "uploads/images");
        } else if (file.mimetype.startsWith("video")) {
            cb(null, "uploads/videos");
        } else {
            cb({ message: "Unsupported file type" }, false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 200 }
}).fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'videoPath', maxCount: 1 }
]);

class MediaController extends MediaModel {
    constructor() {
        super();
        this.createMedia = this.createMedia.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
        this.listMedia = this.listMedia.bind(this);
    }

    async createMedia(req, res) {
        console.log("files +++", req.files)
        console.log("body +++", req.body)
        const { title } = req.body;
        let bannerImagePath;
        let videoFilePath;
        req.files.forEach(file => {
            if (file.mimetype.startsWith('image/')) {
                bannerImagePath = path.normalize(file.path).replace(/\\/g, '/');
            } else if (file.mimetype.startsWith('video/')) {
                videoFilePath = path.normalize(file.path).replace(/\\/g, '/');
            }
        });
        if (!bannerImagePath || !videoFilePath) {
            return httpErrors[400];
        }
        const result = await this.model.create({
            title,
            bannerImage: bannerImagePath,
            videoPath: videoFilePath
        });
        return res.status(200).send({ message: httpSuccess, media: result });
    }

    async deleteMedia(req, res) {
        const { id } = req.params;
        const result = await this.model.deleteOne({ _id: id });
        if (!result || result.deletedCount === 0) throw httpErrors[404];
        return res.status(200).send({ message: httpSuccess });
    }

    async listMedia(req, res) {
        let result = await this.model.find();
        if (!result) throw httpErrors[500];
        result = result.map((data) => {
            data = data._doc
            data.videoPath = `${process.env.APP_URL}${data.videoPath}`
            data.bannerImage = `${process.env.APP_URL}${data.bannerImage}`
            return data
        })
        return res.status(200).send({ message: httpSuccess, data: result });
    }
}

const mediaController = new MediaController();

module.exports = mediaController;
