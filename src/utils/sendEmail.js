const nodemailer = require("nodemailer");


const sendEmail = async (options) => {
     
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  const info = await transporter.sendMail(message)

  console.log("Message sent: %s", info.messageId);

}

module.exports = sendEmail 
