const { httpErrors, httpSuccess } = require("../constents");
const CourseModel = require("./CourseModel");
const path = require('path')

class CourseController extends CourseModel {
    constructor() {
        super();
        this.addCourse = this.addCourse.bind(this);
        this.getCourses = this.getCourses.bind(this);
        this.getCourseById = this.getCourseById.bind(this);
        this.updateCourse = this.updateCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    async addCourse(req, res) {
        const { courseName, category, description, video } = req.body;
        if (!courseName || !category || !description) throw httpErrors[400];
        let courseImage = path.normalize(req.files[0].path).replace(/\\/g, '/');
        const result = await this.model.create({
            courseName,
            category,
            description,
            courseImage,
            video
        });
        if (!result) throw httpErrors[500];
        return res.status(200).send({ message: httpSuccess, data: result });
    }

    async getCourses(req, res) {
        const result = await this.model.find().populate('category').populate([{
            path: "video",
            select: {
                bannerImage: { $concat: [process.env.APP_URL, "$bannerImage"] },
                title: "$title",
                videoPath: { $concat: [process.env.APP_URL, "$videoPath"] }
            }
        }])
            .select({
                courseName: 1,
                category: 1,
                description: 1,
                courseImage: { $concat: [process.env.APP_URL, "$courseImage"] },
                video: 1
            });
        if (!result) throw httpErrors[500];
        return res.status(200).send({ message: httpSuccess, data: result });
    }

    async getCourseById(req, res) {
        const courseId = req.params.id;
        const result = await this.model.findById(courseId).populate('category').populate([{
            path: "video",
            select: {
                bannerImage: { $concat: [process.env.APP_URL, "$bannerImage"] },
                title: "$title",
                videoPath: { $concat: [process.env.APP_URL, "$videoPath"] }
            }
        }])
            .select({
                courseName: 1,
                category: 1,
                description: 1,
                courseImage: { $concat: [process.env.APP_URL, "$courseImage"] },
                video: 1
            });
        if (!result) throw httpErrors[404];
        return res.status(200).send({ message: httpSuccess, data: result });
    }

    async updateCourse(req, res) {
        const courseId = req.params.id;
        const { courseName, category, description, video } = req.body;
        const result = await this.model.findByIdAndUpdate(courseId, {
            courseName,
            category,
            description,
            video
        }, { new: true });
        if (!result) throw httpErrors[404];
        return res.status(200).send({ message: httpSuccess, data: result });
    }

    async deleteCourse(req, res) {
        const courseId = req.params.id;
        const result = await this.model.findByIdAndDelete(courseId);
        if (!result) throw httpErrors[404];
        return res.status(200).send({ message: httpSuccess, data: result });
    }

    async getOneCourse(id) {
        const result = await this.model.findOne({ _id: id }).populate('category').populate('video');
        if (!result) throw httpErrors[404];
        return result
    }
}

const courseController = new CourseController();
module.exports = courseController;
