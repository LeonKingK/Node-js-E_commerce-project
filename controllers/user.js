
const petmitDb = require('../models/permit');
const roleDb = require('../models/role');
const DB = require('../models/user');
const Helper = require('../utils/helper');

const register = async (req, res, next) => {
    let userName = await DB.findOne({ name: req.body.name });
    if (userName) {
        next(new Error("User name is already in use"));
        return;
    };

    let userEmail = await DB.findOne({ email: req.body.email });
    if (userEmail) {
        next(new Error("User email is already in use"));
    };

    req.body.password = Helper.encode(req.body.password);
    let result = await new DB(req.body).save();
    Helper.fMsg(res, "User register is success", result);

};

const login = async (req, res, next) => {

    let dbUser = await DB.findOne({ phone: req.body.phone }).populate('permitId roleId').select('-__v');

    if (dbUser) {

        if (Helper.comparePass(req.body.password, dbUser.password)) {
            let user = dbUser.toObject();
            delete user.password;
            user.token = Helper.makeToken(user);
            Helper.set(user._id, user);
            Helper.fMsg(res, "Login successful", user);

        } else {
            next(new Error("Login credential error"));
        };

    } else {
        next(new Error("Login credential error"));
    };
};

const addRole = async (req, res, next) => {
    let dbUser = await DB.findById(req.body.userId);
    let dbRole = await roleDb.findById(req.body.roleId);

    let foundRole = dbUser.roleId.find(rid => rid.equals(dbRole._id));

    if (foundRole) {
        next(new Error("Role already exit"));
    } else {
        await DB.findByIdAndUpdate(dbUser._id, { $push: { roleId: dbRole._id } });
        let user = await DB.findById(dbUser.id);
        Helper.fMsg(res, "Added Role to user", user);
    };
};

const removeRole = async (req, res, next) => {

    let dbUser = await DB.findById(req.body.userId);
    let foundRole = dbUser.roleId.find(rid => rid.equals(req.body.roleId));

    if (foundRole) {
        await DB.findByIdAndUpdate(dbUser._id, { $pull: { roleId: req.body.roleId } });
        Helper.fMsg(res, "Role removed");
    } else {
        next(new Error("Role doesn't exit"));
    };
};

const addPermit = async (req, res, next) => {

    let dbUser = await DB.findById(req.body.userId);
    let dbPermit = await petmitDb.findById(req.body.permitId);

    let foundPermit = dbUser.permitId.find(pid => pid.equals(dbPermit._id));

    if (foundPermit) {
        next(new Error("Permition is already exit"));
    } else {
        await DB.findByIdAndUpdate(dbUser._id, { $push: { permitId: dbPermit._id } });
        let permit = await DB.findById(dbUser._id);
        Helper.fMsg(res, "Permition is added", permit);
    }
};

const removePermit = async (req, res, next) => {
    let dbUser = await DB.findById(req.body.userId);

    let foundPermit = dbUser.permitId.find(pid => pid.equals(req.body.permitId));
    if (foundPermit) {
        await DB.findByIdAndUpdate(dbUser._id, { $pull: { permitId: req.body.permitId } });
        Helper.fMsg(res, "Permission is removed");
    } else {
        next(new Error("Permission not found"));
    }

}

module.exports = {
    register,
    login,
    addRole,
    removeRole,
    addPermit,
    removePermit
}