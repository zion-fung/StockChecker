const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.emailUser,
        pass: process.env.emailPass
    }
});

async function sendEmail(html) {
    let mailOptions = {
        from: process.env.emailUser,
        to: process.env.emailDest,
        subject: "StockChecker Alert",
        html: html
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
}

module.exports = { sendEmail };