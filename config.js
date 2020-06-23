/** Common config for message.ly */

// read .env files and make environmental variables

require("dotenv").config();


const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql:///messagely_test"
  : "postgresql:///messagely_test";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;

const TWILIO_AUTH_TKN = process.env.TWILIO_AUTH_TKN;

const ACCOUNT_SID = process.env.ACCOUNT_SID;


module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  ACCOUNT_SID,
  TWILIO_AUTH_TKN
};