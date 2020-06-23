const express = require('express');
const User = require('../models/user');
const ExpressError = require('../expressError');
const { ensureCorrectUser } = require('../middleware/auth')
const router = new express.Router();


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', async (req, res, next) => {
  try {
    const users = await User.all();
    return res.json({ users });
  } catch (err) {
    next(err);
  };
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser,  async (req, res, next) => {
  try {
    const { username } = req.params;
    let user = await User.get(username);
    if (user === undefined) throw new ExpressError('USER DOESN\'T EXIST', 404);
    return res.json({ user });
  } catch (err) {
    next(err);
  };
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async (req, resp, next) => {
  try {
    const { username } = req.params;
    const messages = await User.messagesTo(username);
    if (!messages.length) throw new ExpressError(`${username} does not have messages`, 404);
    return resp.json({ messages });
  } catch (err) {
    next(err);
  }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser,  async (req, resp, next) => {
  try {
    const { username } = req.params;
    const messages = await User.messagesFrom(username);
    if (!messages.length) throw new ExpressError(`${username} does not have messages`, 404);
    return resp.json({ messages });
  } catch (err) {
    next(err);
  }
})



module.exports = router;