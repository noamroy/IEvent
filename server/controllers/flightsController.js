
const moment = require('moment');
const axios = require('axios');
const { API_KEY } = require('../constants');
const Flight = require('../models/flights');
const { response } = require('express');
exports.flightsController = {
    async getFlight(req, res) {
        Flight.findOne({ id: req.params.id })
            .then(docs => {
                if (!docs) {
                    res.status(404).send("No such flight ID");
                }
                const timeOfArrival = new Date(docs.arrivalTime).toISOString().slice(0, 10);
                console.log(timeOfArrival);
                const axiosUrlApiCall = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${docs.arrivalCity}/${timeOfArrival}?unitGroup=metric&key=${API_KEY}`;
                console.log(axiosUrlApiCall);
                axios.get(axiosUrlApiCall)
                    .then(response => {
                        var stringDocs= JSON.stringify(docs);
                        var parsedToJsonDocs = JSON. parse(stringDocs);
                        parsedToJsonDocs.weatherData = response.data;
                        res.json(parsedToJsonDocs);
                    })
                    .catch(err => {
                        console.log(`Error: ${err}`)
                        res.status(404).send(err);
                    });
                
            })
            .catch(err => console.log(`Error getting flight from db: ${err}`));
    },
    getFlights(req, res) {
        Flight.find({})
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting flight from db: ${err}`));
    },
    async addFlight(req, res) {
        const { body } = req;
        const result = await Flight.findOne({ id: body.id }).select("_id").lean();
        if (result) {
            res.status(401).send("Id exists");
            return;
        }
        try {
            const newFlight = new Flight(body);
            const result = await newFlight.save();
            if (result) {
                res.json(result);
            }
            else {
                res.status(404).send("Eror saving a flight");
            }
        } catch (error) {
            res.status(404).send(error)
        }
    },

    updateFlight(req, res) {
        const { body } = req;
        Flight.updateOne({ id: req.params.id }, { body })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting flight from db: ${err}`));
    },
    deleteFlight(req, res) {
        Flight.deleteOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error delteting flight from db: ${err}`));
    }
};