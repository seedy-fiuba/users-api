const User = require("../models/User");
const apiResponse = require("../utils/responses");

exports.saveUser = [
    (req, res) => {
        try {
            var user = new User ({ name: "pepito", lastName: "perez" });

            user.save(function (err) {
                if (err) {
                    return apiResponse.unexpectedError(res, err);
                }
                return apiResponse.createdOk(res, user);
            })
        } catch (err) {
            return apiResponse.unexpectedError(res, err);
        }
    }
];