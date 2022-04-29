import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { connect } from 'mongoose';
import { getLocations, createLocation, setLocationPreviewImage, addLocationImage, setDescription, clearLocationImages, removeLocationImage } from './models/Location';
import { postImage, ImageModel } from './models/Image';
import * as fs from 'fs';
import * as multer from 'multer';
import { disconnect } from 'mongoose';

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

//Disconnect from database on close
process.on('SIGINT', () => {
    disconnect()
    .then(() => {
        console.log("Disconnected from database");
        process.exit(0);
    });
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

app.get('/locations', (req:Request, res:Response): void => {
    let campus: string = req.query.campus.toString();

    getLocations(campus)
    .then(obj => {
        res.status(200).send(obj);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.patch('/setDescription', (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }

    setDescription(req)
    .then(id => {
        res.status(200).send(id);
    })
    .catch(err => {
        res.status(400).send(err);
    })
})

app.post('/newLocation', (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }

    createLocation(req)
    .then(id => {
        res.status(200).send(id);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.patch('/setLocationPreviewImage', (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }

    setLocationPreviewImage(req)
    .then(id => {
        res.status(200).send(id);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.patch('/addLocationImage', (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }
    
    addLocationImage(req)
    .then(id => {
        res.status(200).send(id);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.patch('/clearLocationImages', (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }
    
    clearLocationImages(req)
    .then(id => {
        res.status(200).send(id);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.patch('/removeLocationImage', (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }
    
    removeLocationImage(req)
    .then(id => {
        res.status(200).send(id);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.post('/uploadImage', pictureUpload, (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }
    
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

app.get('/images/:id', (req: Request, res: Response): void => {
    //TODO: Add checks and error handling
    let fileid = req.params.id.toString();

    ImageModel.findById(fileid)
    .then(file => {
        res.contentType('image/png');
        res.send(file.img.data);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.delete('/delImage/:id', (req:Request, res:Response): void => {
    if (!req.query.key || req.query.key.toString() !== process.env.EDIT_KEY) {
        res.status(400).send("Err: invalid credentials");
        return;
    }
    
    let id = req.params.id.toString();

    ImageModel.findByIdAndDelete(id)
    .then(() => {
        console.log(`Image ${id} deleted`);
        res.status(200).send();
    })
    .catch(err => {
        res.status(400).send(err);
    });
});