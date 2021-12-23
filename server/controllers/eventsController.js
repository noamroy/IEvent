
const moment = require('moment');
const axios = require('axios');
const { API_KEY } = require('../constants');
const Event = require('../models/events');
const { response } = require('express');
exports.eventsController = {
    async getEvent(req, res) {
        console.log("Get event");
        Event.findOne({ id: req.params.id })
            .then(docs => {
                if (!docs) {
                    res.status(404).send("No such Event ID");
                    return;
                }
                res.json(docs);
                
            })
            .catch(err => console.log(`Error getting Event from db: ${err}`));
    },
    getEvents(req, res) {
        console.log("Get events");
        Event.find({})
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting Event from db: ${err}`));
    },
    async addEvent(req, res) {
        console.log("addEvent");
        const { body } = req;
        var highest_id = 1;
        const result = await Event.find({});
        if (result) {
            res.status(401).send("Id exists");
            return;
        }
        try {
            const newEvent = new Event({
                "id": ++highest_id,
                "eventname": body.eventname,
                "eventadress": body.eventadress,
                "eventdate": body.eventdate,
                "eventcause": body.eventcause,
                "eventnotes": body.eventnotes
            });
            const result = await newEvent.save();
            if (result) {
                res.json(result);
            }
            else {
                res.status(404).send("Eror saving a Event");
            }
        } catch (error) {
            res.status(404).send(error)
        }
    },

    updateEvent(req, res) {
        console.log("updateEvent");
        const { body } = req;
        Event.updateOne({ id: req.params.id }, { body })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting Event from db: ${err}`));
    },
    deleteEvent(req, res) {
        Event.deleteOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting Event from db: ${err}`));
    }
};