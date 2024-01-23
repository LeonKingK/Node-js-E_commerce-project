const jswt = require('jsonwebtoken');
const Helper = require('../utils/helper');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            let result = schema.validate(req.body);
            if (result.error) {
                next(new Error(result.error.details[0].message))
            } else {
                next();
            }
        }
    },
    validateParam: (schema, name) => {
        return (req, res, next) => {
            let obj = {};
            obj[`${name}`] = req.params[`${name}`];
            let result = schema.validate(obj);
            if (result.error) {
                next(new Error(result.error.details[0].message))
            } else {
                next();
            }
        }
    },

    validateToken: () => {
        return async (req, res, next) => {
            if (!req.headers.authorization) {
                next(new Error("Tokenization Error"));
                return;
            };
            let token = req.headers.authorization.split(" ")[1];
            if (token) {
                try {
                    let decode = jswt.verify(token, process.env.SECRET_KEY);
                    if (decode) {
                        let user = await Helper.get(decode._id);
                        if (user) {
                            req.user = user;
                            next();
                        } else {
                            next(new Error("Tokenization Error"));
                        }
                    } else {
                        next(new Error("Tokenization Error"));
                    };
                } catch (error) {
                    next(new Error("Tokenization Error"));
                }
            } else {
                next(new Error("Tokenization Error"));
            };


        }
    },
    validateRole: (role) => {
        return async (req, res, next) => {
            let foundRole = req.user.roleId.find(ro => ro.name == role);
            if (foundRole) {
                next();
            } else {
                next(new Error("You don't have this permission"));
            }

        }
    },

    hasAnyRole: (roles) => {
        return async (req, res, next) => {
            let bol = false;

            for (let i = 0; i < roles.length; i++) {
                let hasRole = req.user.roleId.find(ro => ro.name === roles[i]);
                if (hasRole) {
                    bol = true;
                    break;
                };
            };
            if (bol) next();
            else next(new Error("You don't have enough role"));
        }

    },
    hasAnyPermit: (permits) => {
        return async (req, res, next) => {
            let bol = false;
            for (let i = 0; i < permits.length; i++) {
                let hasPermit = req.user.permitId.find(pm => pm.name === permits[0]);
                bol = true;
                break;
            };

            if(bol) next();
            else next(new Error("You don't have enough permit"));
        };

    }
}