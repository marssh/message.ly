/** User class for message.ly */
const db = require('../db');
const bcrypt = require('bcrypt');
const BCRYPT_WORK_FACTOR = 12;

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(`
      INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
      VALUES($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
      RETURNING username, password, first_name, last_name, phone;`, [username, hashedPassword, first_name, last_name, phone]);
    return result.rows[0];
  };

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(`
    SELECT username, password FROM users WHERE username = $1
    `, [username]);
    const user = result.rows[0];
    return await bcrypt.compare(password, user.password);
  };

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(`
      UPDATE users
      SET last_login_at = current_timestamp
      where username = $1
      `, [username]);
  };

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const results = await db.query(`
    SELECT username, first_name, last_name
    FROM users;
    `);
    return results.rows;
  };

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(`
    SELECT username, first_name, last_name, phone, join_at, last_login_at
    FROM users WHERE username = $1;
    `, [username])
    return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
  WHERE to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(`
    SELECT m.id, m.to_username, m.body, m.sent_at, m.read_at, u.first_name, u.last_name, u.phone
    FROM messages "m"
    JOIN users "u"
    ON m.to_username = u.username
    WHERE m.from_username = $1;
    `, [username]);
    
    return results.rows.map(u => {

      return ({
        id: u.id,
        to_user: {
          username: u.to_username,
          first_name: u.first_name,
          last_name: u.last_name,
          phone: u.phone
        },
        body: u.body,
        sent_at: u.sent_at,
        read_at: u.read_at
      })
    })
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const results = await db.query(`
    SELECT m.id, m.from_username, u.first_name, u.last_name, u.phone, m.body, m.sent_at, m.read_at
    FROM messages "m"
    JOIN users "u"
    ON m.from_username = u.username
    WHERE to_username = $1;
    `, [username]);
  

    return results.rows.map(m => {
      return ({
        id: m.id,
        from_user: {
          username: m.from_username,
          first_name: m.first_name,
          last_name: m.last_name,
          phone: m.phone
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at
      });
    });
  }

  static async forgotLogin(username, randomCode) {
    const result = await db.query(`
      UPDATE users
      SET pwd_reset_code = $1
      where username = $2
      `, [randomCode, username]);
  };

  static async getCode(username, code) {
    const result = await db.query(`
    SELECT username
    FROM users WHERE (username = $1 and pwd_reset_code = $2);
    `, [username, code])
    return result.rows[0];
  }

  static async changePassword(password, username) {
    let newPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(`
    UPDATE users
    SET password = $1, pwd_reset_code=NULL
    WHERE username = $2
    RETURNING username;
    `, [newPassword, username])
    return result.rows[0];
  }
}

module.exports = User;
