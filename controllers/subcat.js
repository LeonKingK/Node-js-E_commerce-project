
const DB = require('../models/subcat');
const catDB = require('../models/category');
const Helper = require('../utils/helper');


const all = async (req, res) => {
    let result = await DB.find();
    Helper.fMsg(res, "All sub categories ", result);
};

const get = async (req, res, next) => {
    let dbsubcat = await DB.findById(req.params.id);
    if (dbsubcat) {
        Helper.fMsg(res, "All sub category", dbsubcat);

    } else {
        next(new Error("No sub category with that id"));
    }
};

const add = async (req, res, next) => {
    let catName = await DB.findOne({ name: req.body.name });
    if (catName) {
        next(new Error("Sub Category name is already in use"));
    } else {
        let dbCat = await catDB.findById(req.body.catid);
        if (dbCat) {
            let result = await new DB(req.body).save();
            await catDB.findByIdAndUpdate(dbCat._id, { $push: { subcats: result._id } });
            Helper.fMsg(res, "Category is added", result);
        } else {
            next(new Error("No category with that id"));
        }
    }
};

const drop = async (req, res, next) => {
    let dbsubcat = await DB.findById(req.params.id);
    if (dbsubcat) {
        await catDB.findByIdAndUpdate(dbsubcat.catid, { $pull: { subcats: dbsubcat._id } });
        await DB.findByIdAndDelete(dbsubcat._id);
        Helper.fMsg(res, "Sub category deleted");
    } else {
        next(new Error("No sub category with that id"));
    }
};

const patch = async (req, res, next) => {
    let dbsubcat = await DB.findById(req.params.id);
    if (dbsubcat) {
        await DB.findByIdAndUpdate(dbsubcat._id, req.body);
        let result=await DB.findById(dbsubcat._id);
        Helper.fMsg(res, "Sub category is updated", result);
    } else {
        next(new Error("No sub category with that id"));
    }
};

module.exports = {
    add,
    all,
    drop,
    get,
    patch
}