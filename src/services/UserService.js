const User = require('../models/User');
const bcrypt = require('bcryptjs');
const constants = require('../utils/constants');
const UserError = require('../exceptions/UserError');

exports.createUser = async (data) => {
    const userData = await getUserByMail(data.email);
    if (userData)
        throw new UserError(constants.error.CONFLICT_ERROR, 'User already registered');

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(data.password, salt);

    const user = new User({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: password,
        role: data.role
    });

    try {
        const savedUser = await user.save(); //save user in database
        return {
            id: savedUser._id,
            name: savedUser.name,
            lastName: savedUser.lastName,
            email: savedUser.email,
            password: savedUser.password,
            role: savedUser.role
        };
    } catch (error) {
        throw new UserError(constants.error.UNEXPECTED_ERROR, 'Couldnt save user');
    }
}

getUserByMail = async (email) => {
    return User.findOne({ email: email });
}

