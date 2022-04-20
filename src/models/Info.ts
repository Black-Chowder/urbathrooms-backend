const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const infoSchema = new Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    rating: { type: Number, require: true, default: 0 }
});

const Info = module.exports = mongoose.model("Info", infoSchema);

module.exports.getInfo = (id: string, callback) => {
    const query = { id };
    Info.findOne(query, callback);
}