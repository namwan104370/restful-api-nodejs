const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BannerSchema = new Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
        index: true
    },
    status: {
        type: String,
        default: 'ACTIVE',
        enum: ['ACTIVE','INACTIVE', 'DELETED', 'WAITING', 'QUEUED', 'PENDING', 'PROCESSING', 'DRAFT'],
        index: true
    },
},
{
    versionKey: false,
    autoIndex: true 
})

const BannerModel = mongoose.model('banner', BannerSchema)

module.exports = BannerModel
