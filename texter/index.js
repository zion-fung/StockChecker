const client = require('twilio')(process.env.twilioAccountSID, process.env.twilioAuthToken);

async function sendMessage(body) {
    await client.messages
    .create({
        body: body,
        from: process.env.twilioSenderNumber,
        to: process.env.twilioReceiverNumber,
    });
}

module.exports = { sendMessage };