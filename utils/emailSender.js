require('dotenv').config();
const nodemailer = require("nodemailer");
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
const sendEmail = async (user,link) => {
    try {


        await mailTransporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Journal Account Password Reset",
            html:
                `<div>
            &ensp;Dear ${user.username},
        </div>
        <br>
        <div>
            &ensp;Please use the following code to reset your password: &ensp;${link}
        </div>`
        });
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { sendEmail };