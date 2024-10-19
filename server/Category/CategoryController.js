const { httpErrors, httpSuccess } = require("../constents");
const CategoryModel = require("./CategoryModel");

class CategoryController extends CategoryModel {
    constructor() {
        super();
        this.addCategory = this.addCategory.bind(this)
        this.listCategory = this.listCategory.bind(this)
    }

    async addCategory(req, res) {
        const { name, alias } = req.body
        if (!name || !alias) throw httpErrors[400]
        const result = await this.model.create({ ...req.body })
        if (!result) throw httpErrors[500]
        return res.status(200).send({ message: httpSuccess, data: result })
    }

    async listCategory(req,res){
        const result = await this.model.find()
        if(!result) throw httpErrors[500]
        return res.status(200).send({message:httpSuccess, data:result})
    }
}

const categoryController = new CategoryController()
module.exports = categoryController