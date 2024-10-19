const { httpErrors, httpSuccess } = require("../constents");
const courseController = require("../Course/CourseController");
const UserCourseModel = require("./UserCourseModel");

class UserCourseController extends UserCourseModel {
    constructor() {
        super();
        this.enrollUserInCourse = this.enrollUserInCourse.bind(this);
        this.updateCompletedVideo = this.updateCompletedVideo.bind(this);
        this.getUserCourses = this.getUserCourses.bind(this);
        this.getUserCoursesDetails = this.getUserCoursesDetails.bind(this);
        this.removeUserFromCourse = this.removeUserFromCourse.bind(this);
    }

    async enrollUserInCourse(req, res) {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) throw httpErrors[400];
        let result = await courseController.getOneCourse(courseId)
        if (!result) throw httpErrors[500]
        let totalVideos = result.video.length
        result = await this.model.create({ userId, courseId, totalVideos });
        if (!result) throw httpErrors[500];
        return res.status(200).send({ message: httpSuccess, data: result });
    }

    async updateCompletedVideo(req, res) {
        const { courseId, videoId, userId } = req.body
        if (!courseId || !videoId || !userId) throw httpErrors[400];
        const userCourse = await this.model.findOne({ userId: userId, courseId: courseId });
        if (!userCourse) throw httpErrors[404];
        console.log(userCourse)

        if (userCourse.completedVideo.includes(videoId)) {
            return res.status(400).send({ message: "Video already marked as completed" });
        }
        userCourse.completedVideo.push(videoId);
        const totalCompleted = userCourse.completedVideo.length;
        const progress = (totalCompleted / userCourse.totalVideos) * 100;
        userCourse.progress = Math.round(progress);
        if (progress === 100) {
            userCourse.status = 'Completed';
        }
        const updatedUserCourse = await userCourse.save();
        if (!updatedUserCourse) throw httpErrors[500];
        return res.status(200).send({ message: httpSuccess, data: updatedUserCourse });
    }

    async getUserCourses(req, res) {
        const { id } = req.params;
        if (!id) throw httpErrors[400]
        try {
            const result = await this.model.find({ userId: id })
                .populate({
                    path: 'courseId',
                    select: 'courseName description courseImage category',
                    populate: {
                        path: 'category',
                        select: 'name alias'
                    }
                })
                .populate({
                    path: 'completedVideo',
                    select: 'title videoPath',
                });

            if (!result || result.length === 0) throw httpErrors[404]

            const formattedResult = result.map(userCourse => {
                return {
                    userId: userCourse.userId,
                    course: {
                        ...userCourse.courseId._doc,
                        courseImage: `${process.env.APP_URL}${userCourse.courseId.courseImage}`,
                        completedVideos: userCourse.completedVideo.map(video => ({
                            title: video.title,
                            videoPath: `${process.env.APP_URL}${video.videoPath}`,
                        })),
                        progress: userCourse.progress,
                        status: userCourse.status,
                        totalVideos: userCourse.totalVideos
                    },
                    createdAt: userCourse.createdAt,
                    updatedAt: userCourse.updatedAt,
                };
            });
            if (!formattedResult) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: formattedResult });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "An error occurred while fetching courses", error: error.message });
        }
    }
    async getUserCoursesDetails(req, res) {
        const { courseId, userId } = req.body
        if (!courseId || !userId) throw httpErrors[400]
        try {
            const result = await this.model.findOne({ userId: userId, courseId })
                .lean()
                .populate({
                    path: 'courseId',
                    select: 'courseName description courseImage category video', 
                    populate: {
                        path: 'category', 
                        select: 'name alias' 
                    },
                    populate: {
                        path: 'video', 
                        select: 'title bannerImage videoPath' 
                    }
                })

            if (!result) throw httpErrors[404]
            result.courseId.courseImage = `${process.env.APP_URL}${result.courseId.courseImage}`;
            result.courseId.video = result.courseId.video.map((video) => ({
                ...video,
                bannerImage: `${process.env.APP_URL}${video.bannerImage}`,
                videoPath: `${process.env.APP_URL}${video.videoPath}`
            }))
            if (!result) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess, data: result });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "An error occurred while fetching courses", error: error.message });
        }
    }


    async removeUserFromCourse(req, res) {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) throw httpErrors[400];
        const result = await this.model.findOneAndDelete({ userId, courseId });
        if (!result) throw httpErrors[404];
        return res.status(200).send({ message: httpSuccess, data: result });
    }
}

const userCourseController = new UserCourseController();
module.exports = userCourseController;
