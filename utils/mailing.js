const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

// import view template from directory
const WelcomeEmailTemplate = fs.readFileSync(
  path.join(__dirname, "../views/welcome10x.hbs"),
  "utf8"
);
const SubscriptionTemplate = fs.readFileSync(
  path.join(__dirname, "../views/subscription.hbs"),
  "utf8"
);
const FreeAcessTemplate = fs.readFileSync(
  path.join(__dirname, "../views/freeAccess.hbs"),
  "utf8"
);
const resetPassword = fs.readFileSync(
  path.join(__dirname, "../views/resetPassword.hbs"),
  "utf-8"
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const welcomeMail = async ({ fullname, email }) => {
  try {
    const template = handlebars.compile(WelcomeEmailTemplate);

    //pass email atrribute into templates
    const emailBody = template({ fullname, email });

    const info = await transporter.sendMail({
      from: process.env.FROM_NAME,
      to: email,
      subject: "Welcome to 10x-Revenue",
      html: emailBody,
    });
    console.log(`Email Successfully sent to ${email}`, info.messageId);
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

const mailSubscription = async ({ email }) => {
  try {
    const template = handlebars.compile(SubscriptionTemplate);

    //pass email atrribute into templates
    const emailBody = template({ email });

    const info = await transporter.sendMail({
      from: process.env.FROM_NAME,
      to: email,
      subject: "Welcome to 10x-Revenue NewsLetter",
      html: emailBody,
    });
    console.log(`Email Successfully sent to ${email}`, info.messageId);
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

const mailFreeAccess = async ({ email }) => {
  try {
    const template = handlebars.compile(FreeAcessTemplate);

    //pass email atrribute into templates
    const emailBody = template({ email });

    const info = await transporter.sendMail({
      from: process.env.FROM_NAME,
      to: email,
      subject: "Welcome",
      html: emailBody,
    });
    console.log(`Email Successfully sent to ${email}`, info.messageId);
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

const forgotPassword = async ({ fullname, email, newPassword }) => {
  try {
    const template = handlebars.compile(resetPassword);

    //pass email atrribute into templates
    const emailBody = template({ fullname, email, newPassword });

    const info = await transporter.sendMail({
      from: process.env.FROM_NAME,
      to: email,
      subject: "Forgot Password",
      html: emailBody,
    });
    console.log(`Email Successfully sent to ${email}`, info.messageId);
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

module.exports = {
  welcomeMail,
  mailSubscription,
  mailFreeAccess,
  forgotPassword,
};
