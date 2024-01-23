const DB=require('../models/permit');
const helper=require('../utils/helper');

const all=async(req,res,next)=>{
    let permits=await DB.find().select('-__v');
    helper.fMsg(res,"All permissions",permits);
};

const get=async(req,res,next)=>{
    let permit=await DB.findById(req.params.id).select('-__v');
    if(permit){
    helper.fMsg(res,"Single permission",permit);
    }else{
        next(new Error("No permission with that id"))
    }
}

const add=async (req,res,next)=>{
    
     let dbPermit=await DB.findOne({name:req.body.name});
    if(dbPermit){
        next(new Error("Permission is already in use"));
    }else{
        let result=await new DB(req.body).save();
        helper.fMsg(res,"Permission is saved!",result);
    }
};

const patch=async (req,res,next)=>{
    let dbPermit=await DB.findById(req.params.id);
    if(dbPermit){
        await DB.findByIdAndUpdate(dbPermit._id,req.body);
        let result=await DB.findById(dbPermit._id);
        helper.fMsg(res,"Permission is updated",result);
    }else{
        next(new Error("No permission with that id"));
    }
};

const drop=async (req,res,next)=>{
    let permit=await DB.findById(req.params.id);
    if(permit){
        await DB.findByIdAndDelete(permit._id);
        helper.fMsg(res,"Permission is deleted");
    }else{
        next(new Error("No permission with that id"));
    }
    
}



module.exports={
    add,
    all,
    get,
    patch,
    drop

}