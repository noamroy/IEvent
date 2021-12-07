const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const { flightsRouter } = require("./routers/flightsRouter");
const { authRouter } = require("./routers/authRouter");

app.use('/api/flights', (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send("Unauthorized - No token")

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) return res.status(401).send("Token Not valid");
        next();
    })
});

app.use('/api/flights', flightsRouter);
app.use('/auth', authRouter);

app.unsubscribe((req,res)=>{
    res.status(400).send('Something is wrong!');
});

app.listen(port, () => console.log(`Express server is running on port ${port}`));