import { Schema, Types, model } from 'mongoose';

interface Location{
    latitude: number;
    longitude: number;
    name: string;
    campus: string;
    _id: Types.ObjectId;
    previewImage: string;
}

const locationSchema = new Schema<Location>({
    latitude: { type: Number, require: true },
    longitude: { type: Number, require: true },
    name: { type: String, require: true },
    campus: { type: String, require: false },
    _id: Schema.Types.ObjectId,
    previewImage: { type: String, require: false },
},
{ _id: false, collection: "Locations" });

const LocationModel = model<Location>("Locations", locationSchema);

export const createLocation = (location: Location): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        const newLocation = new LocationModel(location);

        newLocation.save();
    });
}

export const getLocations = (campus: string): Promise<Location[]> => {
    return new Promise<Location[]>(resolve => {
        LocationModel.find({ campus })
        .then(objs => {
            resolve(objs);
        });
    });
}

export default Location;