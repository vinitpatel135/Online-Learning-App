const { default: mongoose } = require("mongoose");

class UserModel {
    constructor() {
        this.schema = new mongoose.Schema({
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            password: { type: String, required: true },
            role: {type: String, enum:["admin", "user"], default:"user"}
        }, { timestamps: true })

        this.model = mongoose.model("tbl_users", this.schema)
    }
}

module.exports = UserModel