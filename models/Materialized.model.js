const mongoose = require('mongoose')

const MaterializedSchema = new mongoose.Schema({
    Name:
    {
        type: String,
        required: true
    },
    userCount:
    {
        type: Number,
        required: true
    },
    updatedAt:
    {
        type: Date,
        default: Date.now
    }
}


);
const Materialized = mongoose.model('Materialized', MaterializedSchema)
module.exports = Materialized;