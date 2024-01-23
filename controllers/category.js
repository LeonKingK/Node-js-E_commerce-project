const DB = require('../models/category');
const Helper = require('../utils/helper');


const add = async (req, res, next) => {
    const dbCat = await DB.findOne({ name: req.body.name });
    if (dbCat) {
        next(new Error("Name is already exit"));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Category saved", result);
    }
};

const all = async (req, res, next) => {
    let result = await DB.find().populate({
        path: 'subcats',
        populate: {
            path: 'childcats',
            model: 'childcat',
        }
    }
    );
    Helper.fMsg(res, "All categories", result);
};

const get = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id);
    if (dbCat) {
        Helper.fMsg(res, "Single category ", dbCat);
    } else {
        next(new Error("No category with that id"));
    }
};

const drop = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id);
    if (dbCat) {
        let result = await DB.findByIdAndDelete(dbCat._id);
        Helper.fMsg(res, "Category deleted ");
    } else {
        next(new Error("No category with that id"));
    }
};

const patch = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id);
    if (dbCat) {
        await DB.findByIdAndUpdate(dbCat._id, req.body);
        let result = await DB.findById(dbCat._id);
        Helper.fMsg(res, "Category is updated", result);
    } else {
        next(new Error("No category with that id"));
    }
};

module.exports = {
    add,
    all,
    get,
    drop,
    patch
}