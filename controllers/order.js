const DB = require('../models/order');
const ProductDB = require('../models/product');
const OrderItemDB = require('../models/orderitem');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
    const user = req.user;
    const items = req.body.items;

    let saveOrder = new DB();
    let orderItemsObj = [];
    let total = 0;

    for await (let item of items) {
        let product = await ProductDB.findById(item.id);
        let obj = {
            order: saveOrder._id,
            count: item.count,
            productId: product._id,
            name: product.name,
            price: product.price
        };
        orderItemsObj.push(obj);
        total += product.price * item.count;
    };
    
    let orderItemResult = await OrderItemDB.insertMany(orderItemsObj);
    console.log(orderItemResult);

    let orderItemids = orderItemResult.map(item => item._id);

    saveOrder.user = user._id;
    saveOrder.items = orderItemids;
    saveOrder.count = items.length;
    saveOrder.total = total;
    let result = await saveOrder.save();
    Helper.fMsg(res,"Saved order",result);
};

let getMyOrders=async(req,res,next)=>{
    let authUser=req.user;
    let orders=await DB.find({user:authUser._id});
    Helper.fMsg(res,"All Your Orders",orders);
}

module.exports = {
    add,
    getMyOrders
}