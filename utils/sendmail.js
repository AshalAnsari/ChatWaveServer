const nodemailer = require("nodemailer");
// const EmailHtml = require("../views/EmailScreen.jsx")
const hbs = require('nodemailer-express-handlebars');
const path = require('path')

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const handlebarOptions = {
  viewEngine: {
      partialsDir: path.resolve('./views/'),
      defaultLayout: false,
  },
  viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

// async..await is not allowed in global scope, must use a wrapper
async function SendEmail(recipient, token) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"ChatWave 👻" <${process.env.USER}>`, // sender address
    to: recipient, // list of receivers
    subject: "Hello ✔", // Subject line
    template:"email", 
    context:{
      token:token,
      recipient:recipient
    }
  });

  console.log("Message sent!");
  return  { messageId: info.messageId, recipientAddress: recipient }; 
}


module.exports = {SendEmail}