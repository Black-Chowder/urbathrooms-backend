import { Schema, Types, model } from 'mongoose';

interface Image{
    img: { data: Buffer, contentType: string};
}

const imageSchema = new Schema<Image>({
    img: { data: Buffer, contentType: String },
},
{ collection: "Images" });

export const ImageModel = model<Image>("Images", imageSchema);

export const postImage = (image: Image): Promise<string> => {
    return new Promise<string>(resolve => {
        const newImage = new ImageModel(image);

        newImage.save()
        .then(() => {
            resolve(newImage._id.toString());
        });
    })
}