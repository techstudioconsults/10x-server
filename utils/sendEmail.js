/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    // create reusable transporter object using default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
               user: process.env.SMTP_EMAIL,
               pass: process.env.SMTP_PASSWORD
        },
        tls:{
            rejectUnauthorized: false
        },
    });

 
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.emailBody
  }

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);

}

module.exports = sendEmail  