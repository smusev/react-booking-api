const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Rides',
        required: true,
    },
    slots: [{
        wagon:{
            type: Number,
            requred: true
        }, 
        seatNumber: {
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        }
    }],
})

module.exports = mongoose.model('Order', orderSchema)