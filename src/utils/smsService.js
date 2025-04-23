const axios = require('axios');
const nodemailer = require('nodemailer');

const MSG24x7_CONFIG = {
    apiKey: "kHFPySuWgghHK%2Bk7K5zhte3QU%2FjBlCA6Z%2BMs115MJ4w%3D",  // URL encoded
    clientId: "47c96a99-5147-4f63-94a3-aca5ac813dc4",
    baseUrl: "http://control.msg24x7.com/api/v2/SendSMS"
};

const NINZA_CONFIG = {
    apiKey: '1014d8f5cddc7e57e4d1054e76042cfc2357',
    senderId: 1014,
    endpoint: 'https://ninzasms.in.net/send-otp.php'
};

// async function sendOtpToPhone(phone, otp) {
//     try {
//         let data = JSON.stringify({
//             "variables_values": otp,
//             "route": "otp",
//             "numbers": phone
//         });

//         console.log(data);

//         const apiKey = process.env.FAST2SMS_ACCESS_TOKEN;
//         const endpointUrl = process.env.FAST2SMS_ENDPOINT;

//         const response = await axios.post(endpointUrl, data, {
//             headers: {
//                 'Authorization': apiKey,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(response.data)
//         return response.data;

//     } catch (error) {
//         console.error({ error: error.message });
//         throw error;
//     }
// }

async function sendSms(phone, otp) {
    try {
        const payload = {
            ApiKey: MSG24x7_CONFIG.apiKey,
            ClientId: MSG24x7_CONFIG.clientId,
            SenderId: "SMSCLB", // Replace with your approved Sender ID
            Message: otp,
            MobileNumbers: phone,
            Is_Unicode: "false", // Set to true for Unicode messages
            Is_Flash: "false"
        };

        const response = await axios.post(MSG24x7_CONFIG.baseUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("SMS Sent Successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error sending SMS:", error.response?.data || error.message);
        throw error;
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID, // replace with your own Gmail address
        pass: process.env.GMAIL_PASSWORD // replace with your own Gmail password
    }
});

const commonMailFunction = async (email, subject, template, ccEmail, text = '', attachments = []) => {
    try {
        const mailOptions = {
            from: process.env.FROM_MAIL,   // Sender Email
            to: email,                     // Recipient Email
            subject: subject,              // Email Subject
            html: template,                // HTML Template
            text: String(text)             // Plain Text (converted to string)
        };

        // Add CC Email if provided
        if (ccEmail) {
            mailOptions.cc = ccEmail;
        }

        // Attachments (if any)
        if (attachments.length > 0) {
            mailOptions.attachments = attachments.map(file => ({
                filename: file.filename,
                path: file.path,
                contentType: file.type || ''
            }));
        }

        // Send Email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        return error;
    }
};

async function sendOtpToPhone(phone, otp) {
    try {
        const payload = {
            sender_id: NINZA_CONFIG.senderId,
            variables_values: otp,
            numbers: phone
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': NINZA_CONFIG.apiKey
        };

        const response = await axios.post(NINZA_CONFIG.endpoint, payload, { headers });
        console.log("✅ OTP sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error sending OTP:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    sendOtpToPhone,
    sendSms,
    // sendOtp,
};