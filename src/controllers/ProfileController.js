let UserService = require('../services/UserService');
const UserError = require('../exceptions/UserError');
const responses = require('../utils/responses');
const constants = require('../utils/constants');

exports.setUserService = (service) => {
  UserService = service;
};

exports.editProfile = [
  async (req, res, next) => {
    try {
      const filter =  await UserService.getUserByMail(req.body.email);
      // throw error when email is wrong
      if (!filter)
        throw new UserError(constants.error.BAD_REQUEST, 'No user registered with this email.');

      const update = {name: req.body.name, lastName: req.body.lastName, password: req.body.password, description: req.body.description};
      let doc =  await UserService.updateUserByMail(filter, update);
      return responses.statusOk(res, doc);
    } catch(e) {
      next(e);
    }
  }
];