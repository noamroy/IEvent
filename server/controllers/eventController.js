//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const Event = require('../models/event');
const Log = require('./logger');
//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
GET REQUEST: getAllEvents()
GET REQUEST: getSpecificEvent(path = '/id')
POST REQUEST: createEvent(body = all params except for id)
PATCH REQUEST: updateEvent(path = '/id', body = all new params)
DELETE REQUEST: deleteEvent(path = '/id')
*/
exports.eventController = {
    async getAllEvents(req, res) {
        Log.logger.info(`EVENT CONTROLLER REQ: Get all events`);
        const answer = await Event.find()
            .catch(err => {
                Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
            });
        if (answer.length!=0){
            Log.logger.info(`EVENT CONTROLLER RES: Get all events`);
            res.json(answer);
        }
        else{
            Log.logger.info(`EVENT CONTROLLER RES: no events in DB`);
            res.status(404).json({status: 404 , msg: `No events in DB`});
        }
    },
    async getSpecificEvent(req, res) {
        const eventId = req.path.substring(1)
        Log.logger.info(`EVENT CONTROLLER REQ: Get specific event number ${eventId}`);
        if (isNaN(eventId)){
            Log.logger.info(`EVENT CONTROLLER RES: input is nan error "${eventId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
        }
        else{
            var eventData = await Event.find({ id: Number(eventId)})
                .catch(err => {
                    Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                });
            if (eventData.length!=0){
                eventData = eventData[0];
                Log.logger.info(`EVENT CONTROLLER RES: get event data number: ${eventId}`);
                res.json(eventData);
            }
            else{
                Log.logger.info(`EVENT CONTROLLER RES: Didn't find event number: ${eventId}`);
                res.status(404).json({status: 404 , msg: `Didn't find event number: ${eventId}`});
            }
        }
    },
    async createEvent(req, res) {
        Log.logger.info(`EVENT CONTROLLER REQ: POST add an event`);
        const body = req.body;
        console.log(body);
        let eventId = await NeighborhoodSystem.find()
            .catch(err => {
                Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
        });
        if (eventId.length!=0)
            eventId = eventId[(eventId.length)-1].id+1;
        else
            eventId=1;
        console.log(body.type);
        console.log(body.name);
        console.log(body.address);
        console.log(body.ip);
        console.log(body.mode);
        console.log(body.mode);
        if (body.type && body.name && body.address &&
            body.ip && body.mode && body.program){
                const newNeighborhoodSystem = new NeighborhoodSystem({
                    "type": body.type,
                    "name": body.name,
                    "address": body.address,
                    "ip": body.ip,
                    "mode": body.mode,
                    "program": body.program,
                    "id": eventId
                });
                const result = newNeighborhoodSystem.save();
                if (result) {
                    Log.logger.info(`EVENT CONTROLLER RES: add event number ${eventId}`);
                    res.json(newNeighborhoodSystem);
                } else {
                    Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                }
        } else {
            Log.logger.info(`EVENT CONTROLLER RES: Input error!`);
            res.status(400).json({status: 400 , msg: `Input error!`});
        }
    },
    async updateNeighborhoodSystem(req, res) {
        const eventId = req.path.substring(1);
        Log.logger.info(`EVENT CONTROLLER REQ: update an event number: ${eventId}`);
        if (isNaN(eventId)){
            Log.logger.info(`EVENT CONTROLLER RES: input is nan error "${eventId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
        }
        else {
            let body = req.body;
            let newNeighborhoodSystem = await NeighborhoodSystem.find({ id: Number(eventId)})
                .catch(err => {
                    Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                });
            if (newNeighborhoodSystem.length == 0){
                Log.logger.info(`EVENT CONTROLLER RES: Didn't find event number: ${eventId}`);
                res.status(404).json({status: 404 , msg: `Didn't find event number: "${eventId}"`});
            }
            else {
                newNeighborhoodSystem = newNeighborhoodSystem[0];
                if (body.type)
                    newNeighborhoodSystem.type=body.type;
                if (body.name)
                newNeighborhoodSystem.name=body.name;
                if (body.address)
                newNeighborhoodSystem.address=body.address;
                if (body.ip)
                    newNeighborhoodSystem.ip=body.ip;
                if (body.mode)
                newNeighborhoodSystem.mode=body.mode;
                if (body.program)
                    newNeighborhoodSystem.program=body.program;
                NeighborhoodSystem.updateOne({ id: eventId }, {
                type: newNeighborhoodSystem.type,
                name: newNeighborhoodSystem.name,
                address: newNeighborhoodSystem.address,
                ip: newNeighborhoodSystem.ip,
                mode: newNeighborhoodSystem.mode,
                program: newNeighborhoodSystem.program})
                    .catch(err => {
                        Log.logger.info(`EVENT CONTROLLER ERROR: update event ${err}`);
                        res.status(500).json({status: 500 , msg: `Error update a event`});
                    });
                res.json(body)
            }
        }
    },
    async deleteNeighborhoodSystem(req, res) {
        const eventId = req.path.substring(1)
        Log.logger.info(`EVENT CONTROLLER REQ: Get specific event number ${eventId}`);
        if (isNaN(eventId)){
            Log.logger.info(`EVENT CONTROLLER RES: input is nan error "${eventId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
        }
        else{
            Log.logger.info(`EVENT CONTROLLER RES: delete event number: ${eventId}`);
            NeighborhoodSystem.deleteOne ({ id: Number(eventId)})
                .then(docs => { res.json(docs)})
                .catch(err => {
                    Log.logger.info(`EVENT CONTROLLER ERROR: deleting event from db: ${err}`);
                    res.status(500).json({status: 500 , msg: `Server delete error`});
                });
        }
    }
};
