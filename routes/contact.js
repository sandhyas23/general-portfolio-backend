// Send email when contacted
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

router.post('/', (req, res) => {
    try {
        const {website,content,fromEmail,name} = req.body.message;
        const mailOptions = {
            from: process.env.email,
            to: process.env.email,
            subject: `New message from your portfolio from ${name}` ,
            html: `Hi,<br/>${content}<br/><b>Website:</b> ${website}<br/>Regards,<br/>${name}<br/>${fromEmail}`
        };

        transporter.sendMail(mailOptions, (err, info)=> {
            if (err) {
                res.status(500).json({success: false, message: 'Something went wrong. Try again later'});
            }
            else {
                res.status(200).json({success: true, message: 'Thanks for contacting us. We will get back to you shortly'});
            }
        });
    }
    catch (error) {
        res.status(500).json({success: false, message: 'Something went wrong. Try again later'});
    }
});

module.exports = router;
