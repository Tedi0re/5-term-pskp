const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

function send(mailAddr, mailPass, message){
    const transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: mailAddr,
            pass: mailPass,
        },
    }));

    const mailOptions = {
        from: mailAddr,
        to: mailAddr,
        subject: 'lab_6',
        text: message,
        html: `<i>${message}</i>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            throw new Error(error);
        } else {
            console.log('Email sent: ' + info.response);
            return message;
        }
    });
}

exports.send = send;