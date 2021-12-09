
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../constants');
const User = require('../models/users');

var USER_ID = 1;

function generateAccessToken(id) {
    return jwt.sign(id, TOKEN_SECRET, { expiresIn: '10m' });
}

function genarteToken(jsonString) {
    const tokenBase62 = Buffer.from(jsonString).toString('base64')
    console.log(tokenBase62);
    return tokenBase62
}

exports.usersController = {
    async getUser(req, res) {
        console.log("getUser")
        User.findOne({ id: req.params.id })
            .then(docs => {
                if (!docs) {
                    res.status(404).send("No such User ID");
                }
                res.json(docs);
            })
            .catch(err => console.log(`Error getting User from db: ${err}`));
    },
    getUsers(req, res) {
        console.log("getUsers")
        User.find({})
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting User from db: ${err}`));
    },
    async addUser(req, res) {
        console.log("addUser")
        const { body } = req;
        const result = await User.find({});
        var highest_id = 1;
        result.forEach((user) => {
            if(user.id > highest_id) {
                highest_id = user.id;
            }
        })
        try {
            const newUser = new User({
                id: ++highest_id,
                "userid": body.userid,
                "firstName": body.firstName,
                "lastName": body.lastName,
                "password": body.password,
                "phone": body.phone,
                "email": body.email,
                "usertype": body.usertype
            });
            const result = await newUser.save();
            if (result) {
                res.json(result);
            }
            else {
                res.status(404).send("Eror saving a User");
            }
        } catch (error) {
            res.status(404).send(error)
        }
    },

    updateUser(req, res) {
        console.log("updateUser")
        const { body } = req;
        User.updateOne({ id: req.params.id }, { body })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting User from db: ${err}`));
    },
    deleteUser(req, res) {
        User.deleteOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting User from db: ${err}`));
    }
};