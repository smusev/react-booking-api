const express = require('express');
const router = express.Router();
const Ride = require('../models/ride');
const Wagon = require('../models/wagon');
const Order = require('../models/order');
const ObjectId = require('mongodb').ObjectID;

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Rides 
router.post('/rides', async (req, res) => {
    try {
        const rides = await Ride.find({
            date: {$gt: req.body.date, $lt: new Date(req.body.date).getTime() + 86400000 },
            depart: req.body.depart, 
            arrival: req.body.arrival
        })
        res.json({rides: rides})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/ride', getSlots, async (req, res) => {
    const ride = new Ride({
        date: req.body.date,
        depart: req.body.depart,
        arrival: req.body.arrival,
        departTime: req.body.departTime,
        arrivalTime: req.body.arrivalTime,
        travelTime: req.body.travelTime,
        carts: req.body.carts,
        slots: req.slots
    })

    try {
        const newRide = await ride.save()
        res.status(201).json(newRide)
    } catch(err) { 
        res.status(400).json({message: err.message})
    }})

router.post('/wagon', async (req,res) => {
    const wagon = new Wagon({
        name: req.body.name,
        layout: req.body.layout,
        slots: req.body.slots
    })  

    try {
        const newWagon = await wagon.save()
        res.status(201).json(newWagon)
    } catch(err) { 
        res.status(400).json({message: err.message})
    }
})

router.post('/wagons', async (req, res) => {
    try {
        const wagons = await Wagon.find({
            name:{$in: req.body.wagons }
        })
        res.json({wagons: wagons})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/orders', changeAvailability, async (req, res) => {

    const order = new Order({
        ride: req.body.rideId,
        slots: req.body.slots
    })

    try {
        await order.save()
        console.log('order saved')
        res.status(201).json(order)
    } catch(err) { 
        console.log('order error')
        res.status(400).json({message: err.message})
    }
})

async function changeAvailability(req, res, next){
  let myRide;
  try{
    myRide = await Ride.findOne({_id: ObjectId(req.body.rideId)});
    const newSlots = myRide.slots.map(function(slot){
      if (req.body.slots.some((slt) => {return slt.wagon === slot.cartNumber && slt.seatNumber === slot.seatNumber}
        )){
        slot.available = false;
        return slot
      } else {
        return slot
      }
    });
    myRide.slots = newSlots;
    try {
      await myRide.save()
      console.log('myRide saved')
      next();
    } catch(err) { 
      console.log('myRide save error')
      res.status(400).json({message: err.message})
      next();
    }
  } catch (err) {
    //return ({message: err.message})
    console.log(err.message)
    next();
  }
}

async function getWagon(name) {
    let wagon
    try {
        wagon = await Wagon.findOne(name)
        if (wagon == null) 
            return ({message: 'wagon not found'})
        else 
        return wagon
    } catch(err) {
        return ({message: err.message})
    }
}

async function getSlots (req, res, next) {
    let slots = []
    for (const wagon of req.body.carts) {
        const wagonScheme = await getWagon(wagon.name)
        wagonScheme.slots.forEach((slot) => {
            slots.push({cartNumber:wagon.number, seatNumber:slot.name, price: wagon.price})
        }) 
    }
    req.slots = slots
    next()
}

module.exports = router