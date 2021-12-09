
const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../constants');
const User = require('../models/users');
function generateAccessToken(id) {
    return jwt.sign(id, TOKEN_SECRET, { expiresIn: '10m' });
}

function genarteToken(jsonString){
    const tokenBase62=Buffer.from(jsonString).toString('base64')
    console.log(tokenBase62);
    return tokenBase62
}

exports.authController = {
    async getAuthCode(req, res) {
        User.findOne({ id: req.body.id })
            .then(docs => {
                console.log(docs);
                if (!docs) {
                    res.status(401).send("No such User ID");
                    return;
                }
                // const token = generateAccessToken({ id: req.body.id });
                const token ={
                    token: genarteToken(docs)
                }
                res.json(token);
            })
            .catch(err => console.log(`Error getting user from db: ${err}`));
    }
};