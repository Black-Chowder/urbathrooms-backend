import e = require("express");

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const Info = require('./models/Info');

require('dotenv').config();

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());

//Connect to database
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, mongoOptions)
.then(() => {
    console.log("Established connection to database");
})
.catch(err => {
    console.log("Could not connect to database");
    console.log(err);
});

const port = process.env.PORT || '5000';
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.on("error", err => {
    console.log(err);
});

app.get('/info', (req, res) => {
    console.log(`Requesting info for ${req.query.locId}`);

    Info.findById(req.query.locId)
    .then(obj => {
        if (obj){
            res.status(200).send(obj);
        }
        else{
            res.status(400).send();
        }
    });
});