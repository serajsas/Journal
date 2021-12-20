if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config();
}
const nodemailer = require("nodemailer");
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
const sendCodeEmail = async (user,code) => {
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
            &ensp;Please use the following code to reset your password: &ensp;${code}
        </div>`
        });
        return true;
    } catch (error) {
        return false;
    }
};

const sendRegisterEmail = async (user) => {
    try {


        await mailTransporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Journal Account Has Been Created",
            html:
                `<div>
            &ensp;Dear ${user.username},
        </div>
        <br>
        <div>
            &ensp;This is a notification that a Journal account has been created using this email, enjoy your Journal journey.
        </div>`
        });
        return true;
    } catch (error) {
        return false;
    }
};


const sendResetPasswordEmail = async (user) => {
    try {


        await mailTransporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Journal Account Password Has Been Reset",
            html:
                `<div>
            &ensp;Dear ${user.username},
        </div>
        <br>
        <div>
            &ensp;This is to notify you that your Journal account password has been reset successfully.
        </div>`
        });
        return true;
    } catch (error) {
        return false;
    }
};

const sendUpdatePasswordEmail = async (user) => {
    try {


        await mailTransporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Journal Account Password Has Been Updated",
            html:
                `<div>
            &ensp;Dear ${user.username},
        </div>
        <br>
        <div>
            &ensp;This is to notify you that your Journal account password has been updated successfully.
        </div>`
        });
        return true;
    } catch (error) {
        return false;
    }
};


module.exports = { sendCodeEmail,sendRegisterEmail,sendResetPasswordEmail,sendUpdatePasswordEmail };