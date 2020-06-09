const MailComposer = require("nodemailer/lib/mail-composer");

let message = {
    from: "example@gmail.com",
    to: "example@gmail.com",
    subject: "TEST",
    text: "Hello World"
};

var mail = new MailComposer(message);
mail.compile().build(function(err, message){
    let buffer = Buffer.from(message);
    let data = buffer.toString('base64');
    process.stdout.write(data);
});

// Converts a nodemailer message to base64 for google apis (not used in this project)