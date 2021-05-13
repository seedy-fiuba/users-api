const { OAuth2Client } = require('google-auth-library');
const { body,validationResult } = require("express-validator");
const responses = require("../utils/responses");


exports.loginGoogle = [
    (req, res) => {
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(CLIENT_ID);
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: req.body.idToken,
                audience: CLIENT_ID,
            });
            const payload = ticket.getPayload();
            this.userid = payload['sub'];
            console.log(ticket);
            console.log("User logged: " + this.userid);
        }
        verify().catch((error) => {
            console.error(error);
            responses.unauthorizedResponse(res, error);
        }).then(responses.createdOk(res, { "userId": this.userid }));
    }
]