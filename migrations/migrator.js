const fs=require('fs');

const UserDb=require('../models/user');
const Helper=require('../utils/helper');

const migrate = () =>{
    let data=fs.readFileSync('./migrations/users.json');
    let users=JSON.parse(data);

    users.forEach(async(user)=>{
        user.password=Helper.encode(user.password);
        let result=await new userDb(user).save();
        console.log(result);
    });
    
};

const backup= async () =>{
    let users=await userDb.find();
    fs.writeFileSync('./migrations/backups/users.json',JSON.stringify(users));
    console.log("User DB Backup");
};


module.exports={
    migrate,
    backup
}