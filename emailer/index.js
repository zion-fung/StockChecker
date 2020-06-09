const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.email_user,
        pass: process.env.email_pass
    }
});

async function main(html) {
    let mailOptions = {
        from: process.env.email_user,
        to: process.env.email_dest,
        subject: "StockChecker Alert",
        html: html
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
}

module.exports = { main };