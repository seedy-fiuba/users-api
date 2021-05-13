const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const responses = require("../utils/responses");
const constants = require("../utils/constants");

// validation
const { registerValidation, loginValidation, authenticateValidation } = require("../validation");

// register route
router.post("/register", async (req, res) => {
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
});


// login route
router.post('/login', async (req, res) => {
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
      email: user.email,
      id: user._id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: 30
    }
  );

  responses.statusOk(res, {
    user: user,
    token: token
  })
});


router.post('/authenticate', async (req, res) => {
  const { error } = authenticateValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let token = req.body["authToken"]

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return responses.unauthorizedResponse(res, "unauthorized")
    }
  });

  responses.statusOk(res, {
    message: "authorized"
  })
})

module.exports = router;