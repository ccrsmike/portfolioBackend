const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const config = require('https://clivekema-backend.onrender.com/config.js')
const oAuth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri);
oAuth2Client.setCredentials({ refresh_token: config.refreshToken });

// Create the transport object
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config.userEmail,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: oAuth2Client.getAccessToken(),
    },
});

// Define an email sending route
router.post('/sendMail', async (req, res) => {
    const { name, email, number, subject, message } = req.body;

    try {
        const mailOptions = {
            from: config.userEmail, // Use your Gmail account here
            to: config.userEmail, // Replace with the recipient's email address
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
