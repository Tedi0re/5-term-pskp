const nodemailer = require('nodemailer');

send = (sender, password, message, receiver) =>
{
 
    const mailOptions = {
        from: sender,
        to: receiver,
        text: message
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 587,
        secure: false,
        auth: {
            user: sender,
            pass: password
        }
    });
    transporter.sendMail(mailOptions, (err, info) => {
        err ? console.log(err) : console.log('Sent: ' + info.response);
    })
}

module.exports = send;