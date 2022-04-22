import { Schema, Types, model } from 'mongoose';

interface Location{
    latitude: number;
    longitude: number;
    name: string;
    campus: string;
    _id: Types.ObjectId;
}

const locationSchema = new Schema<Location>({
    latitude: { type: Number, require: true },
    longitude: { type: Number, require: true },
    name: { type: String, require: true },
    campus: { type: String, require: false },
    _id: Schema.Types.ObjectId,
},
{ _id: false, collection: "Locations" });

const LocationModel = model<Location>("Locations", locationSchema);

export const createLocation = (location: Location) => {
    return new Promise<boolean>(resolve => {
        const newLocation = new LocationModel({ 
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
            campus: location.campus,
            _id: location._id 
        });

        newLocation.save();
    });
}

export const getLocations = (campus: string) => {
    return new Promise<Location[]>(resolve => {
        LocationModel.find({ campus })
        .then(objs => {
            resolve(objs);
        });
    });
}

export default Location;