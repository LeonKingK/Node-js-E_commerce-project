const DB = require('../models/product');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
    let DbProduct = await DB.findOne({ name: req.body.name });
    if (DbProduct) {
        next(new Error("Product name is already in use"));
    } else {
        req.body.features = req.body.features.split(",");
        req.body.delivery = req.body.delivery.split(",");
        req.body.warranty = req.body.warranty.split(",");
        req.body.colors = req.body.colors.split(",");

        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Product is saved!", result);
    };
};

const get = async (req, res, next) => {
    let DbProduct = await DB.findById(req.params.id);
    if (DbProduct) {
        Helper.fMsg(res, "Get Product", DbProduct);
    } else {
        next(new Error("No product with id"));
    }
};

const drop = async (req, res, next) => {
    let DbProduct = await DB.findById(req.params.id);
    if (DbProduct) {
        await DB.findByIdAndDelete(DbProduct._id);
        Helper.fMsg(res, "Product is deleted");
    } else {
        next(new Error("No product with that id"));
    }
};

const patch = async (req, res, next) => {
    let DbProduct = await DB.findById(req.params.id);
    if (DbProduct) {
        await DB.findByIdAndUpdate(DbProduct._id, req.body);
        let result = await DB.findById(DbProduct._id);
        Helper.fMsg(res, "Product is Updated", result);
    } else {
        next(new Error("No product with that id"));
    }
};



const paginate = async (req, res, next) => {
    let pageNo = Number(req.params.page);
    let limit = Number(process.env.PAGE_LIMIT);
    let reqPage = pageNo == 1 ? 0 : pageNo - 1;
    let skipCount = limit * reqPage;
    let result = await DB.find().skip(skipCount).limit(limit);
    Helper.fMsg(res, `Paginated page No ${pageNo}`, result);
};


const filterBy = async (req, res) => {
    let type=req.params.type;
    let pageNo = Number(req.params.page);
    let limit = Number(process.env.PAGE_LIMIT);
    let reqPage = pageNo == 1 ? 0 : pageNo - 1;
    let skipCount = limit * reqPage;

    let filterType='cat';
    switch(type){
        case 'cat':filterType= 'cat';break;
        case 'subcat':filterType= 'subcat';break;
        case 'childcat':filterType= 'childcat';break;
        case 'tag':filterType= 'tag';break;
    };

    let filterObj = {};
    filterObj[`${filterType}`]=req.params.id;
    
    let result = await DB.find(filterObj).skip(skipCount).limit(limit);
    Helper.fMsg(res, `Paginate page No ${pageNo}`, result);
};

// const productByTag = async (req, res) => {
//     let pageNo = Number(req.params.page);
//     let limit = Number(process.env.PAGE_LIMIT);
//     let reqPage = pageNo == 1 ? 0 : pageNo - 1;
//     let skipCount = limit * reqPage;
//     let result = await DB.find({ tag: req.params.id }).skip(skipCount).limit(limit);
//     Helper.fMsg(res, `Paginate page No ${pageNo}`, result);
// }

module.exports = {
    patch,
    get,
    drop,
    add,
    filterBy,
    paginate
}