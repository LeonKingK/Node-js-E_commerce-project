const mongoose=require('mongoose');
const { Schema }=mongoose;

const UserSchema=new Schema({
    
    name:{type:String , required:true},
    email:{type:String , required:true , unique:true},
    phone:{type:String , required:true , unique:true},
    password:{type:String , required:true},
    permitId:[{type:Schema.Types.ObjectId,'ref':'permit'}],
    roleId:[{type:Schema.Types.ObjectId , required:true , 'ref':'role'}],
    created:{type:Date , default:Date.now},

});

let User=mongoose.model('user',UserSchema);
module.exports=User;


