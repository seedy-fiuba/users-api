const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// validation
const { validation } = require("../validation");

// register route
router.post("/register", async (req, res) => {
  // validate the user
  const { error } = validation(req.body);

  // throw validation errors
  if (error) return res.status(400).json({ error: error.details[0].message });

  // search for a matching email and throw error when email already registered
  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: password,
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id } });
  } catch (error) {
    res.status(400).json({ error });
  }
});


// login route
router.post('/login', async (req, res) => {
  // validate the user
  const { error } = validation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message })

  // find a matching email
  const user = await User.findOne({ email: req.body.email });
  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });

  // check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Password is wrong" });

  //login successful
  res.json({
    error: null,
    data: {
      message: "Login successful",
    },
  });
});

module.exports = router;