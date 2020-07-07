const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    depart: {
        type: String,
        required: true
    },
    arrival: {
        type: String, 
        required: true, 
    },
    departTime: {
        type: String, 
        required: true
    },
    arrivalTime: { 
        type: String, 
        required: true, 
    },
    travelTime: {
        type: String,
        required: true,
    },
    carts:[{
        number: {
            type: Number,
            requred: true,
        },
        carType: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    slots: [{
        cartNumber: {
            type: Number,
            required: true
        },
        seatNumber: {
            type: String,
            required: true
        },
        available: { 
            type: Boolean, 
            default: true 
        },
        price: {
            type: Number,
            required: true
        },
    }]
})

module.exports = mongoose.model('Ride', rideSchema)