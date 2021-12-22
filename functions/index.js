const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

require("dotenv").config();

const {
    SENDER_EMAIL,
    SENDER_PASSWORD
} = process.env;

exports.sendEmailNotification = functions.firestore.document("users/{userId}").onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"FilmList.ca" <tempiqbal233@gmail.com>',
        to: "swapniliqbal@gmail.com",
        subject: "New User!", // Subject line
        text: `A new user has joined FilmList. Name: ${data.name}, email: ${data.email}`
    });
})