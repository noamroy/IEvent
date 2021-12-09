const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const { eventsRouter } = require("./routers/eventsRouter");
const { usersRouter } = require("./routers/usersRouter");



app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);

app.unsubscribe((req,res)=>{
    res.status(400).send('Something is wrong!');
});

app.listen(port, () => console.log(`Express server is running on port ${port}`));