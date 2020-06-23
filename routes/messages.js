const express = require('express');
const Message = require('../models/message');
const ExpressError = require('../expressError');
const router = new express.Router();
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNTkyODY4MTg5fQ.I6B0bwq0QQay4hUjg8gSiz3-5oC5Iw9MVUHWS_0W3ew"

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', async (req, resp, next) => {
  try {
    const { id } = req.params;
    const message = await Message.get(id);
    return resp.json({ message })
  } catch (err) {
    next(err);
  };
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', async (req, resp, next) => {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;
    const message = await Message.create({ from_username, to_username, body });
    return resp.json({ message })
  } catch (err) {
    next(err);
  }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

// Don't mark my messages as read. Don't leave me on read...
router.post('/:id/read', async (req, resp, next) => {

  try {
    const { id } = req.params;
    const message = await Message.markRead(id);
    return resp.json({ message });
  } catch (err) {
    next(err);
  };
});

module.exports = router;