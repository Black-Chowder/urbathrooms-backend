import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { connect, Types } from 'mongoose';
import { getInfo } from './models/Info';
import { getLocations, createLocation } from './models/Location';

require('dotenv').config();

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());

//Connect to database
const dbURI = process.env.DB_URI;
connect(dbURI, { })
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

app.get('/info', (req:Request, res:Response) => {
    let locId: string = req.query.locId.toString();
    console.log(`Requesting info for ${locId}`);

    getInfo(locId)
    .then(obj => {
        if (obj) res.status(200).send(obj);
        else res.status(400).send();
    });
});

app.get('/locations', (req:Request, res:Response) => {
    let campus: string = req.query.campus.toString();
    console.log(`Requesting locations from campus ${campus}`);

    getLocations(campus)
    .then(obj => {
        res.status(200).send(obj);
    });
});

app.post('/newLocation', (req:Request, res:Response) => {
    //TODO: Add type checks and error handling
    let latitude: number = +req.query.latitude.toString();
    let longitude: number = +req.query.longitude.toString();
    let name: string = req.query.name.toString();
    let campus: string = req.query.campus.toString();
    let id: string = req.query.id.toString();

    createLocation({ latitude, longitude, name, campus, _id: new Types.ObjectId(id) })
    .then(resp => {
        res.status(200).send({});
    });
});