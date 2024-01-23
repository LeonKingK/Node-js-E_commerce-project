const DB = require('../models/warranty');
const Helper = require('../utils/helper');

const all = async (req, res) => {
    let result = await DB.find();
    Helper.fMsg(res, "All warranty is here", result);
};

const add = async (req, res, next) => {
    let DBwarranty = await DB.findOne({ name: req.body.name });
    if (DBwarranty) {
        next(new Error("Warranty name is already in use"));
    } else {
        req.body.remark=req.body.remark.split(",");
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Warranty is added", result);
    }
};

const get = async (req, res, next) => {
    let DBwarranty = await DB.findById(req.params.id);
    if (DBwarranty) {
        Helper.fMsg(res, "Single warranty is here", DBwarranty);
    } else {
        next(new Error("No warranty with that id"));
    }
};

const drop = async (req, res, next) => {
    let DBwarranty = await DB.findById(req.params.id);
    if (DBwarranty) {
        await DB.findByIdAndDelete(DBwarranty._id);
        Helper.fMsg(res, "Single warranty is deleted");
    } else {
        next(new Error("No warranty with that id"));
    }
};

const patch = async (req, res, next) => {
    let DBwarranty = await DB.findById(req.params.id);
    if (DBwarranty) {
        await DB.findByIdAndUpdate(DBwarranty._id, req.body);
        let result = await DB.findById(DBwarranty.id);
        Helper.fMsg(res, "Single warranty is updated", result);
    } else {
        next(new Error("No warranty with that id"));
    }
};

module.exports = {
    all,
    get,
    add,
    drop,
    patch,
}