const { default: mongoose } = require("mongoose");

class UserCourseModel {
    constructor() {
        this.schema = new mongoose.Schema({
            userId: { type: mongoose.Types.ObjectId, required: true, ref:"tbl_users" },
            courseId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_courses" },
            totalVideos: { type: Number, required: true},
            completedVideo: [{ type: mongoose.Types.ObjectId, ref:"tbl_medias"}],
            progress: { type: Number, default: 0 },
            status: { type:String, enum:["Completed", "Pending"], default:"Pending" }
        }, { timestamps: true })

        this.model = mongoose.model("tbl_usercourses", this.schema)
    }
}
module.exports = UserCourseModel