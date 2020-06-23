const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, ACCOUNT_SID, TWILIO_AUTH_TKN } = require('../config');
const ExpressError = require('../expressError');
const router = new express.Router();




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



 module.exports = router;
