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
    name: req.body.name,
    lastName: req.body.lastName,
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



  // create token
  const token = jwt.sign(
    // payload data
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).json({
    error: null,
    data: {
      token,
    },
  });
});

module.exports = router;