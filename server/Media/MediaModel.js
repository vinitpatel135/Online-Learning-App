const { default: mongoose } = require("mongoose");

class MediaModel {
    constructor() {
        this.schema = new mongoose.Schema({
            title: { type: String, required: true },
            bannerImage: { type: String, required: true },
            videoPath: { type: String, required: true }
        }, { timestamps: true })

        this.model = mongoose.model("tbl_medias", this.schema)
    }
}

module.exports = MediaModel