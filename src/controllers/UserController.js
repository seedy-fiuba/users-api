let UserService = require('../services/UserService');
const UserError = require('../exceptions/UserError');
const responses = require('../utils/responses');
const constants = require('../utils/constants');
const User = require('../models/User');

exports.setUserService = (service) => {
  UserService = service;
};
/*
exports.updateUser = [
  async (req, res, next) => {
    try {
      const user =  await UserService.getUserByMail();
      // throw error when email is wrong
      if (!user)
        throw new UserError(constants.error.BAD_REQUEST, 'No user registered with this email.');

      let doc =  await UserService.updateUserByID(user._id, req.body.description);
      return responses.statusOk(res, doc);
    } catch(e) {
      next(e);
    }
  }
];*/

const { registerValidation } = require('../validation');

exports.createUser = async (req, res, next) => {
    // validate the user
    try {
        const {error} = await registerValidation(req.body);

        // throw validation errors
        if (error) {
            throw new UserError(constants.error.BAD_REQUEST, error.details[0].message);
        }

        const userData = await UserService.createUser(req.body);
        return responses.statusOk(res, userData);
    } catch (e) {
        next(e);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const { page, size } = req.query;
        await UserService.getUsers(page, size)
            .then((result) => {
                let bodyResponse = {
                    totalItems: result.totalDocs,
                    users: result.docs,
                    totalPages: result.totalPages,
                    currentPage: result.page - 1
                }

                return responses.statusOk(res, bodyResponse);
            }).catch((err) => {
                throw new UserError(constants.error.UNEXPECTED_ERROR, err);
            });
    } catch (e) {
        next(e);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        // TODO: validate user info based on token
        let user = await UserService.getUserById(req.params.id);
        if (!user)
            throw new UserError(constants.error.NOT_FOUND, "User not found");
        return responses.statusOk(res, user);
    } catch (e) {
        next(e);
    }
};


exports.updateUser = async (req, res, next) => {
    try {
        User.findByIdAndUpdate(
          {_id: req.params.id },
          {description: req.body.description},
          {new: true},
          function(err, result) {
              if (!result) {
                  return responses.notFoundResponse(res, err);
              }
              return responses.statusOk(res, result);
          });
    } catch (e) {
        next(e);
    }
};
/*
exports.deleteUser = async (req, res, next) => {
    try {
        responses.notImplementedError(res);
    } catch (e) {
        next(e);
    }
};
*/

