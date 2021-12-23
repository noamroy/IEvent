//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const User = require('../models/user');
const Log = require('./logger');
//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
POST REQUEST: loginUser() (body = name and pass params)
GET REQUEST: getSpecificNeighborhoodSystem(path = '/id')
POST REQUEST: createNeighborhoodSystem(body = all params except for id)
PATCH REQUEST: updateNeighborhoodSystem(path = '/id', body = all new params)
DELETE REQUEST: deleteNeighborhoodSystem(path = '/id')
*/
exports.userController = {
    async loginUser(req, res) {
        const userName = request.body.name;
        const userPassword = request.body.password;
        Log.logger.info(`LOGIN SYSTEM CONTROLLER REQ: Login Name:${userName}`);
        if (userName && userPassword) {
            const userDataResponse = await User.find({ name: userName })
                .catch(err => {
                    Log.logger.info(`LOGIN SYSTEM CONTROLLER ERROR: Database retriving error `);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error` });
                    return;
                });
            if (userDataResponse.length != 0) {
                const userData = userDataResponse[0];
                if (password == userData.password) {
                    //****************************************************** ADD WHAT TO DO WHEN LOGIN ******************************************
                    Log.logger.info(`Login SYSTEM CONTROLLER RES: Succesfull login: ${userData.id}`);
                    res.status(200).json(userData.id);
                } else {
                    Log.logger.info(`Login SYSTEM CONTROLLER ERROR: Failed login attempt: ${userData.id}`);
                    res.status(401).json({ "status": 401, "msg": `Incorrect password` });
                }
            }
        } else {
            Log.logger.info(`Login SYSTEM CONTROLLER ERROR: LOGIN INPUT ERRPR`);
            res.status(401).json({ "status": 401, "msg": `INPUT ERROR-Please enter username and password` });
        }
    },
    async registerUser(req, res) {
        Log.logger.info(`REGISTER SYSTEM CONTROLLER REQ: POST add a new user`);
        const body = req.body;
        var userId = 0;
        if (body.name && body.password) {
            const userDataResponse = await User.find()
                .catch(err => {
                    Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Database retriving error`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error` });
                    return;
                });
            if (userDataResponse.length!=0)
                userId = userDataResponse[(userDataResponse.length)-1].id+1;
            else
                userId=1;
            try {
                const newUser = new User({
                    id: userId,
                    name: body.name,
                    password: body.password
                });
                const result = newUser.save();
                Log.logger.info(`REGISTER SYSTEM CONTROLLER RES: User added id: ${body.name}`);
                res.json(result);
            } catch (err) {
                Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Error creating user ${err}`);
                res.status(503).json({ "status": 503, "msg": `Error creating user ${err}` });
            }

        } else {
            res.status(401).json({ "status": 401, "msg": `Please enter valid data` });
        }

    }
};