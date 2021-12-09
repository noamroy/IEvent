const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { eventsController } = require('../controllers/eventsController');
const eventsRouter = new Router();
module.exports = { eventsRouter };

eventsRouter.get('/', eventsController.getEvents); // {host}/api/events
eventsRouter.get('/:id', eventsController.getEvent); // {host}/api/events/:id
eventsRouter.post('/', eventsController.addEvent); // {host}/api/events
eventsRouter.put('/:id', eventsController.updateEvent); // {host}/api/events/:id
eventsRouter.delete('/:id', eventsController.deleteEvent); // {host}/api/events/:id