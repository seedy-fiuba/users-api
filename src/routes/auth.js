const router = require('express').Router();

router.post('/login', async (req, res) => {
  console.log(req.body)

  let email = ""
  let password = ""

  try {
    email = req.body["email"]
    password = req.body["password"]
  } catch (e) {
    console.log(e);
    console.error(e.message)

    res.status(500).send('some field is misssing!');
    return
  }

  let respBody = {
    "full_name": "Hello " + email + " with pass " + password
  }

  res.status(200).json(respBody);
})

module.exports = router;