import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { connect, Types } from 'mongoose';
import Info, { getInfo } from './models/Info';
import { getLocations, createLocation } from './models/Location';
import { postImage, ImageModel } from './models/Image';
import * as fs from 'fs';
import * as multer from 'multer';

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

//Setup Multer
const upload = multer({ dest: 'uploads/'});
const pictureUpload = multer({ dest: 'uploads/' }).single(`picture`);

const port = process.env.PORT || '5000';
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.on("error", err => {
    console.log(err);
});

app.get('/info', (req:Request, res:Response) => { //TODO: Actual error handling!
    let locId: string = req.query.locId.toString();

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
        res.status(200).send();
    });
});

app.post('/uploadImage', pictureUpload, (req:Request, res:Response) => {
    //TODO: Add checks and error handling
    let encode_image = fs.readFileSync(req.file.path).toString('base64');
    let data = Buffer.from(encode_image, 'base64');
    let contentType = req.file.mimetype;
    postImage({ img: { data, contentType} })
    .then(id => {
        fs.rm(req.file.path, () => {
            res.status(200).send(id);
        });
    })
    .catch(err => {
        fs.rm(req.file.path, () => {});
        res.status(400).send(err);
    });
});

app.get('/getImage/:id', (req: Request, res: Response) => {
    //TODO: Add checks and error handling
    let fileid = req.params.id.toString();

    ImageModel.findById(fileid)
    .then(file => {
        res.contentType('image/png');
        res.send(file.img.data);
    })
    .catch(err => {
        res.status(400).send(err);
    })
});