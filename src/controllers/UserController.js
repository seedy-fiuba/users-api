let UserService = require('../services/UserService');
const UserError = require('../exceptions/UserError');
const responses = require('../utils/responses');
const constants = require('../utils/constants');

exports.setUserService = (service) => {
  UserService = service;
};

exports.updateUser = [
  async (req, res, next) => {
    try {
      const filter =  await UserService.getUserByMail();
      // throw error when email is wrong
      if (!filter)
        throw new UserError(constants.error.BAD_REQUEST, 'No user registered with this email.');

      let doc =  await UserService.updateUserByMail(req.body.email, req.body.description);
      return responses.statusOk(res, doc);
    } catch(e) {
      next(e);
    }
  }
];