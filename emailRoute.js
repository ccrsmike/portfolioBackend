const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const refreshToken = process.env.REFRESH_TOKEN;
const user = process.env.MY_EMAIL;

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

// Create the transport object
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: user,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: oAuth2Client.getAccessToken(),
    },
});

// Define an email sending route
router.post('/sendMail', async (req, res) => {
    const { name, email, number, subject, message } = req.body;

    try {
        const mailOptions = {
            from: user, // Use your Gmail account here
            to: user, // Replace with the recipient's email address
            subject: subject,
            text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nMessage: ${message}`,
        };

        // Send the email
        await transport.sendMail(mailOptions);

        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending email', error: error.message });
    }
});

module.exports = router;
