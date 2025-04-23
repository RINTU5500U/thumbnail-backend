const axios = require('axios');

async function sendOtpToPhone(phone, otp) {
    try {
        let data = JSON.stringify({
            "variables_values": otp,
            "message": `Your OTP is ${otp}`,
            "language": "english",
            "route": "q",
            "numbers": phone
        });

        console.log(data);

        const apiKey = process.env.FAST2SMS_ACCESS_TOKEN;
        const endpointUrl = process.env.FAST2SMS_ENDPOINT;

        const response = await axios.post(endpointUrl, data, {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error({ error: error.message });
        throw error;
    }
}

module.exports = {
    sendOtpToPhone
};