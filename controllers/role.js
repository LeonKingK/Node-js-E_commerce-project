const DB=require('../models/role');
const Helper=require('../utils/helper');
const PermitDb=require('../models/permit');

const add=async(req,res,next)=>{
    let roleName=await DB.findOne({name:req.body.name});
    if(roleName){
        next (new Error("Role name is already in use"));
    }else{
        let result=await new DB(req.body).save();
        Helper.fMsg(res,"Role name is added",result);
    }
};

const all=async (req,res,next)=>{
    let result=await DB.find().populate('permits','-__v');
    Helper.fMsg(res,"All role",result);
};


const get=async(req,res,next)=>{
    let dbRole=await DB.findById(req.params.id).select('-__v');
    if(dbRole){
        Helper.fMsg(res,"Single role",dbRole);
    }else{
        next(new Error("No role with that id"));
    }
};

const patch=async (req,res,next)=>{
    let dbRole=await DB.findById(req.params.id).select('-__v');
    if(dbRole){
    await DB.findByIdAndUpdate(dbRole._id,req.body);
    let result=await DB.findById(dbRole._id);
    Helper.fMsg(res,"Role is updated",result);
    }
};

const drop=async (req,res,next)=>{
    let dbRole=await DB.findById(req.params.id).select('-__v');
    if(dbRole){
        await DB.findByIdAndDelete(dbRole);
        Helper.fMsg(res,"Role is deleted");
    }else{
        next(new Error("No role with that id"));
    }
};

const roleAddPermit=async(req,res,next)=>{
    let dbRole=await DB.findById(req.body.roleId);
    let dbPermit=await PermitDb.findById(req.body.permitId);

    if(dbRole && dbPermit){
        let result=await DB.findByIdAndUpdate(dbRole._id,{$push:{permits:dbPermit._id}});
        Helper.fMsg(res,"Permit add to Role",result);
    }else{
        next (new Error("Role ID and Permit Id are needed"))
    };
};

const roleRomovePermit=async (req,res,next)=>{
    let dbRole=await DB.findById(req.body.roleId);
    let dbPermit=await PermitDb.findById(req.body.permitId);
    if(dbRole && dbPermit){
        let result=await DB.findByIdAndUpdate(dbRole._id,{$pull:{permits:dbPermit._id}});
        Helper.fMsg(res,"Permit remove to role",result);
    }else{
        next (new Error("Role id and Permit id are needed"));
    }
}


module.exports={
    add,
    all,
    get,
    patch,
    drop,
    roleAddPermit,
    roleRomovePermit
}