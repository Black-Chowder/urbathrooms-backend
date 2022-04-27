import { Request } from 'express';
import { Schema, Types, model } from 'mongoose';

interface Location{
    latitude: number;
    longitude: number;
    name: string;
    rating: number;
    description: string,
    campus: string;
    previewImage: string;
    images: string[];
}

const locationSchema = new Schema<Location>({
    latitude: { type: Number, require: true },
    longitude: { type: Number, require: true },
    name: { type: String, require: true },
    rating: { type: Number, require: true, default: 0 },
    description: { type: String, require: false, default: "No Description Provided" },
    campus: { type: String, require: false, default: "River" },
    previewImage: { type: String, require: false },
    images: [{ type: String }],
},
{ collection: "Locations" });

const LocationModel = model<Location>("Locations", locationSchema);

export const createLocation = (req: Request): Promise<string> => {
    return new Promise<string>(resolve => {
        //TODO: Add getters and setters for all of these
        const latitude = req.query.latitude.toString();
        const longitude = req.query.longitude.toString();
        const name = req.query.name.toString();
        const rating = 0;
        const description = "";//TODO: Set description separately
        const campus = req.query.campus.toString();
        //Set preview image and images separately
        const previewImage: string = "";
        const images: string[] = [];

        const newLocation = new LocationModel({ latitude, longitude, name, rating, description, campus, previewImage, images })
        
        newLocation.save()
        .then(() => {
            resolve(newLocation._id.toString());
        })
    });
}

export const setDescription = (req:Request): Promise<string> => {
    return new Promise<string>(resolve => {
        const id = req.query.id.toString();
        const description = req.query.description.toString();
        const update = { description };

        LocationModel.findByIdAndUpdate(id, update)
        .then(obj => {
            console.log(`Description of id:${id} updated`);
            resolve(id);
        });
    });
}

export const setLocationPreviewImage = (req:Request): Promise<string> => {
    return new Promise<string>(resolve => {
        const id = req.query.id.toString();
        const previewImage = req.query.previewImage.toString();
        const update = { previewImage };

        LocationModel.findByIdAndUpdate(id, update)
        .then(obj => {
            resolve(obj._id.toString());
        });
    });
}

export const addLocationImage = (req:Request): Promise<string> => {
    return new Promise<string>(resolve => {
        const id = req.query.id.toString();
        const newImage = req.query.imageId.toString();
        //TODO: Find a way to not make 2 db queries when updating array of image ids
        LocationModel.findById(id)
        .then(obj => {
            const images = [
                ...obj.images,
                newImage,
            ];

            LocationModel.findByIdAndUpdate(id, { images })
            .then(obj => {
                resolve(obj._id.toString());
            });
        });
    });
}

export const clearLocationImages = (req:Request): Promise<string> => {
    return new Promise<string>(resolve => {
        const id = req.query.id.toString();
        LocationModel.findByIdAndUpdate(id, { images: [] })
        .then(obj => {
            resolve(id);
        })
    })
}

export const removeLocationImage = (req:Request): Promise<string> => {
    //TODO: Allow for accepting image index OR image id
    return new Promise<string>(resolve => {
        const id = req.query.id.toString();
        const imageIndex = +req.query.imageIndex.toString();
        LocationModel.findById(id)
        .then(obj => {
            const images: string[] = [];
            for (let i = 0; i < obj.images.length; i++){
                if (i === imageIndex) continue;
                images.push(obj.images[i]);
            }

            LocationModel.findByIdAndUpdate(id, { images })
            .then(obj => {
                resolve(id);
            });
        });
    })
}

export const getLocations = (campus: string): Promise<Location[]> => {
    return new Promise<Location[]>(resolve => {
        LocationModel.find(campus === "*" ? {} : { campus })
        .then(objs => {
            resolve(objs);
        });
    });
}

export default Location;