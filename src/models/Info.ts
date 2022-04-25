import { Request } from 'express';
import { model, Schema } from 'mongoose';

interface Info{
    name: string;
    description: string;
    rating: number;
    imageIds: string[];
}

const infoSchema = new Schema<Info>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    rating: { type: Number, require: true, default: 0 },
    imageIds: [{ type: String }],
},
{ collection: "Info" });

const Info = model<Info>("Info", infoSchema);

export const getInfo = (id: string): Promise<Info> => {
    return new Promise<Info>(resolve => {
        Info.findById(id)
        .then(obj => {
            resolve(obj);
        })
        .catch(err => {
            resolve(err);
        })
    });
}

export const newInfo = (req:Request): Promise<string> => {
    return new Promise<string>(resolve => {
        //TODO: Add type checks and error handling
        const name = req.query.name.toString();
        const description = req.query.description.toString();
        const rating = +req.query.rating.toString();
        const imageIds = [];
        const newInfo = new Info({ name, description, rating, imageIds });

        newInfo.save()
        .then(() => {
            resolve(newInfo._id.toString());
        });
    });
}

export default Info;