const { Router } = require('express');

const { usersController } = require('../controllers/usersController');
const usersRouter = new Router();
module.exports = { usersRouter };

usersRouter.get('/', usersController.getUsers); // {host}/api/Users
usersRouter.get('/:id', usersController.getUser); // {host}/api/Users/:id
usersRouter.post('/', usersController.addUser); // {host}/api/Users
usersRouter.put('/:id', usersController.updateUser); // {host}/api/Users/:id
usersRouter.delete('/:id', usersController.deleteUser); // {host}/api/Users/:id