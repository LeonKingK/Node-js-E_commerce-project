const DB = require('../models/childcat');
const SubCatDb = require('../models/subcat');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let result = await DB.find();
    Helper.fMsg(res, "All child category", result);
};

const get = async (req, res, next) => {
    let childCatDb = await DB.findById(req.params.id);
    if (childCatDb) {
        Helper.fMsg(res, "Single child category", childCatDb);
    } else {
        next(new Error("No child category with that id"));
    }
};

const add = async (req, res, next) => {
    let dbchildcat = await DB.findOne({ name: req.body.name });
    if (dbchildcat) {
        next(new Error("Name is already in use"));
    } else {
        let subCat = await SubCatDb.findById(req.body.subcatid);
        if (subCat) {
            let result = await new DB(req.body).save();
            await SubCatDb.findByIdAndUpdate(subCat._id, { $push: { childcats: result._id } });
            Helper.fMsg(res, "Child category is saved", result);
        } else {
            next(new Error("No sub category with that id"));
        }

    }
};

const drop = async (req, res, next) => {
    let childCatDb = await DB.findById(req.params.id);
    if (childCatDb) {
        await SubCatDb.findByIdAndUpdate(childCatDb.subcatid, { $pull: { childcats: childCatDb._id } });
        await DB.findByIdAndDelete(childCatDb._id);
        Helper.fMsg(res, "Child category is deleted");
    } else {
        next(new Error("No child category with that id"));
    }
};

const patch=async (req,res,next)=>{
    let childCatDb=await DB.findById(req.params.id);
    if(childCatDb){
        await DB.findByIdAndUpdate(childCatDb._id,req.body);
        let result=await DB.findById(childCatDb._id);
        Helper.fMsg(res,"Child category is updated",result);
    }else{
        next(new Error("No child category with that id"));
    }
}
module.exports = {
    get,
    all,
    add,
    drop,
    patch
}