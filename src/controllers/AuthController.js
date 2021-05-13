const { OAuth2Client } = require('google-auth-library');
const { body,validationResult } = require("express-validator");
const responses = require("../utils/responses");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const constants = require("../utils/constants");

// validation
const { registerValidation, loginValidation } = require("../validation");

exports.register = [
    async (req, res) => {
        // validate the user
        const { error } = registerValidation(req.body);

        // throw validation errors
        if (error) return res.status(400).json({ error: error.details[0].message });

        // search for a matching email and throw error when email already registered
        const isEmailExist = await User.findOne({ email: req.body.email });
        if (isEmailExist)
            return res.status(409).json({ error: "Email already exists" });

        // hash the password
        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            password: password,
            role: req.body.role
        });

        try {
            const savedUser = await user.save(); //save user in database
            responses.createdOk(res, savedUser);
        } catch (error) {
            res.status(400).json({ error });
        }
    }
]

exports.login = [
    async (req, res) => {
        // validate the user
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message })

        const user = await User.findOne({ email: req.body.email });

        // throw error when email is wrong
        if (!user) return res.status(400).json({ error: "Email is wrong" });

        // check for password correctness
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(401).json({ error: "Password is wrong" });

        // create token
        const token = jwt.sign(
            // payload data
            {
                name: user.name,
                id: user._id,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: 30
            }
        );
        res.header("auth-token", token).json({
            error: null,
            data: {
                token,
            },
        });
    }
]

exports.loginGoogle = [
    (req, res) => {
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(CLIENT_ID);
        const payload = undefined;

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: req.body.idToken,
                audience: CLIENT_ID,
            });
            const payload = ticket.getPayload();
            this.userid = payload['sub'];

            var userData = await User.findOne({ email: payload['email'] });
            if (!userData) {
                const user = new User({
                    name: payload['given_name'],
                    lastName: payload['family_name'],
                    email: payload['email'],
                    password: "-",
                    role: "-" //TODO: Set role
                });

                userData = user.save((err) => {
                    if (err)
                        responses.unexpectedError(res, err);
                });
            }

            console.log(userData);

            const token = jwt.sign(
                // payload data
                {
                    name: userData.name,
                    id: userData._id,
                },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: 30
                }
            );

            responses.statusOk(res, { "user": userData, "token": token})
        }
        verify().catch((error) => {
            console.error(error);
            responses.unauthorizedResponse(res, error);
        })
    }
]