const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
    temperature: {type: Number},
    Humidity: {type: Number}
    },
    {
    collection: 'data'
    }
)

module.exports = mongoose.model('Data', DataSchema)