const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, ACCOUNT_SID, TWILIO_AUTH_TKN } = require('../config');
const ExpressError = require('../expressError');
const sendSMS = require('../send_sms');
const router = new express.Router();


router.get('/login', function (req, res, next) {
  return res.render("login.html");
});

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      User.updateLoginTimestamp(username);
      return res.json({ token: jwt.sign({username}, SECRET_KEY) });
    };
    throw new ExpressError("Invalid username/password", 400);
  } catch (err) {
    next(err);
  }
});



router.get('/register', function (req, res, next) {
  return res.render("register.html");
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async function (req, res, next) {
  try {
    let newUser = await User.register(req.body);
    let username = newUser.username
    return res.json({ token: jwt.sign({username}, SECRET_KEY) });
  } catch (err) {
    next(err);
  }
})

router.get('/forgot', async (req, res, next) => {
  //generate random code..
  //Could put in a helper function
  let randomCode = '';
  while (randomCode.length < 6) {
    randomCode = String(Math.floor(Math.random() * 999999));
  }
  try {
    const { username } = req.body;
    const { phone } = await User.get(username);
    console.log(phone);
    sendSMS(phone, `Here is your six digit code...${randomCode}`);
    await User.forgotLogin(username, randomCode);
    return res.json({message: "Let\'s reset your password"})
  } catch (err) {
    next(err);
  }
});

router.post('/forgot', async (req, res, next) => {
  try {
    const { code, username, password: newPassword } = req.body;
    const getCode = await User.getCode(username, code);
    if (getCode === undefined) throw new ExpressError('Code does not exist', 400);
    const name = await User.changePassword(newPassword, username);
    return res.json({message: `${name.username} has been changed!!!`})
  } catch (err) {
    next(err);
  };
});


 module.exports = router;
