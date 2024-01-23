const DB = require('../models/tag');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let result = await DB.find();
    Helper.fMsg(res, "All tag is here", result);
};

const get = async (req, res, next) => {
    let DBtag = await DB.findById(req.params.id);
    if (DBtag) {
        Helper.fMsg(res, "Single tag", DBtag);
    } else {
        next(new Error("No tag with that id"));
    };
};


const add = async (req, res, next) => {
    let DBtag = await DB.findOne({ name: req.body.name });
    if (DBtag) {
        next(new Error("Name is already in use"));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Tag is added", result);
    };

};

const drop = async (req, res, next) => {
    let DBtag = await DB.findById(req.params.id);
    if (DBtag) {
        await DB.findByIdAndDelete(DBtag._id);
        Helper.fMsg(res, "Tag is deleted");
    } else {
        next(new Error("No tag with that id"));
    };
};

const patch = async (req, res, next) => {
    let tag = await DB.findById(req.params.id);
    if (tag) {
        let DBtag = await DB.findOne({ name: req.body.name });
        if (DBtag) {
            next(new Error("Name is already in use"));
        } else {
            await DB.findByIdAndUpdate(tag._id, req.body);
            let result = await DB.findById(tag._id);
            Helper.fMsg(res, "Tag is updated", result);
        };
    } else {
        next(new Error("No tag with that id"));
    }
}



module.exports = {
    all,
    add,
    get,
    drop,
    patch
};