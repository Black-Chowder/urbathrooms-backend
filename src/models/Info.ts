import { model, Schema } from 'mongoose';

interface Info{
    name: string;
    description: string;
    rating: number;
}

const infoSchema = new Schema<Info>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    rating: { type: Number, require: true, default: 0 }
},
{ collection: "Info" });

const Info = model<Info>("Info", infoSchema);

export const getInfo = (id: string) => {
    return new Promise<Info>(resolve => {
        Info.findById(id)
        .then(obj => {
            resolve(obj);
        });
    });
}

export default Info;