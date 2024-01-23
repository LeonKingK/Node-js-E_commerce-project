const DB = require('../models/delivery');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let result = await DB.find();
    Helper.fMsg(res, "All delivery", result);
};

const add = async (req, res, next) => {
    let DBdeli = await DB.findOne({ name: req.body.name });
    if (DBdeli) {
        next(new Error("Name is already in use"));
    } else {
        req.body.remark = req.body.remark.split(",");
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Delivery is added", result);
    };
};

const get = async (req, res, next) => {
    let DBdeli = await DB.findById(req.params.id);
    if (DBdeli) {
        Helper.fMsg(res, "Get single delivery", DBdeli);
    } else {
        next(new Error("No delivery with that id"));
    };
};

const drop = async (req, res, next) => {
    let DBdeli = await DB.findById(req.params.id);
    if (DBdeli) {
        await DB.findByIdAndDelete(DBdeli._id);
        Helper.fMsg(res, "Single delivery is deleted");
    } else {
        next(new Error("No delivery with that id"));
    };
};

const patch = async (req, res, next) => {
    let deliId = await DB.findById(req.params.id);
    if (deliId) {
        await DB.findByIdAndUpdate(deliId._id, req.body);
        let result = await DB.findById(deliId._id);
        Helper.fMsg(res, "Single delivery is updated", result);

    } else {
        next(new Error("No delivery with that id"));
    }
}

module.exports = {
    add,
    all,
    get,
    drop,
    patch
}