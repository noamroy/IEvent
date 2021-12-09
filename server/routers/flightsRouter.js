const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { flightsController } = require('../controllers/flightsController');
const flightsRouter = new Router();
module.exports = { flightsRouter };

flightsRouter.get('/', flightsController.getFlights); // {host}/api/flights
flightsRouter.get('/:id', flightsController.getFlight); // {host}/api/flights/:id
flightsRouter.post('/', flightsController.addFlight); // {host}/api/flights
flightsRouter.put('/:id', flightsController.updateFlight); // {host}/api/flights/:id
flightsRouter.delete('/:id', flightsController.deleteFlight); // {host}/api/flights/:id