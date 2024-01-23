const fs = require('fs');

const UserDb = require('../models/user');
const RoleDb = require('../models/role');
const PermitDb = require('../models/permit');

const Helper = require('../utils/helper');

const migrate = () => {
    let data = fs.readFileSync('./migrations/users.json');
    let users = JSON.parse(data);

    users.forEach(async (user) => {
        user.password = Helper.encode(user.password);
        let result = await new userDb(user).save();
        console.log(result);
    });
};

const rpMigrate = () => {
    let data = fs.readFileSync('./migrations/rp.json');
    let rp = JSON.parse(data);

    rp.roles.forEach(async (role) => {
        let result = await new RoleDb(role).save();
        console.log(result);
    });
    rp.permits.forEach(async (permit) => {
        let result = await new PermitDb(permit).save();
        console.log(result);
    })
};

const backup = async () => {
    let users = await UserDb.find();
    fs.writeFileSync('./migrations/backups/users.json', JSON.stringify(users));
    console.log("User DB Backup");
};

const addOwnerRole = async () => {
    let dbOwner = await UserDb.findOne({ phone: "09100100100" });
    let ownerRole = await RoleDb.findOne({ name: "Owner" });
    await UserDb.findByIdAndUpdate(dbOwner._id, { $push: { roleId: ownerRole._id } });
}

module.exports = {
    migrate,
    backup,
    rpMigrate,
    addOwnerRole,
}