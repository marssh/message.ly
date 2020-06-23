// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const { ACCOUNT_SID, TWILIO_AUTH_TKN } = require('./config');
const client = require('twilio')(ACCOUNT_SID, TWILIO_AUTH_TKN);

function sendSMS(to_phone, body) {
  client.messages
    .create({
      body,
      from: '+12245075186',
      to: `+${to_phone}`
    })
    .then(message => console.log(message.sid))
}

module.exports = sendSMS;