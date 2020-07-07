const mongoose = require('mongoose')

const wagonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    layout: {
        type: String,
        requred: true
    },
    slots: [{
        name:{
            type: String,
            requred: true
        }, 
        coords: [Number],     
    }],
})

module.exports = mongoose.model('Wagon', wagonSchema)