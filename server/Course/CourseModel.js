const { default: mongoose } = require("mongoose");

class CourseModel {
    constructor() {
        this.schema = new mongoose.Schema({
            courseName: { type: String, required: true },
            category: { type: mongoose.Types.ObjectId, required: true, ref:"tbl_categorys" },
            description: { type: String, required: true },
            courseImage:{type: String, required: true },
            video: [{ type: mongoose.Types.ObjectId, ref:"tbl_medias" }]
        }, { timestamps: true })

        this.model = mongoose.model("tbl_courses", this.schema)
    }
}
module.exports = CourseModel