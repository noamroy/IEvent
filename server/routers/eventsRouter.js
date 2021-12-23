const { Router } = require('express');
const { eventController } = require('../controllers/eventController');
const eventRouter = new Router();
module.exports = { eventRouter };

eventRouter.get('/', eventController.getAllEvents); // {host}/api/event
eventRouter.get('/:id', eventController.getSpecificEvent); // {host}/api/event/:id
eventRouter.post('/', eventController.createEvent); // {host}/api/event
eventRouter.put('/:id', eventController.updateEvent); // {host}/api/event/:id
eventRouter.delete('/:id', eventController.deleteEvent); // {host}/api/event/:id