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
            date: {$gte: req.body.date, $lt: new Date(req.body.date).getTime() + 86400000},
            depart: req.body.depart, 
            arrival: req.body.arrival
        })
        res.json( (rides.length <1) ?  {rides: await generateRides(req.body) } : {rides: rides})
        //res.json( {rides: rides})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/ride', async (req, res) => {
    const ride = await createRide(req.body)

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

async function getSlots (carts) {
    let slots = []
    for (const wagon of carts) {
        const wagonScheme = await getWagon(wagon.name)
        wagonScheme.slots.forEach((slot) => {
            slots.push({cartNumber:wagon.number, seatNumber:slot.name, price: wagon.price})
        }) 
    }
    return slots
}

async function createRide (body){
    const slots = await getSlots(body.carts)
    const ride = new Ride({
        date: body.date,
        depart: body.depart,
        arrival: body.arrival,
        departTime: body.departTime,
        arrivalTime: body.arrivalTime,
        travelTime: body.travelTime,
        carts: body.carts,
        slots: slots
    })
    return ride
}

async function generateRides(req) {
    let newRides = []
    const travels = 
    [{
    departTime: "6:25",
    arrivalTime: "12:05",
    travelTime: "5:40",
    carts:[
        {number: 1, carType: "Купейный", price: 360},
        {number: 2, carType: "Купейный", price: 350},
        {number: 3, carType: "Купейный", price: 340},
        {number: 4, carType: "Купейный", price: 320},
        {number: 5, carType: "Купейный", price: 420},
        {number: 6, carType: "Купейный", price: 450}
        ]
    }, {
    departTime: "7:15",
    arrivalTime: "13:25",
    travelTime: "6:10",
    carts:[
        {number: 1, carType: "Купейный", price: 360},
        {number: 2, carType: "Купейный", price: 350},
        {number: 3, carType: "Купейный", price: 340},
        {number: 4, carType: "Купейный", price: 320},
        {number: 5, carType: "Купейный", price: 420},
        {number: 6, carType: "Купейный", price: 450}
        ]
    }, {
    departTime: "10:55",
    arrivalTime: "17:05",
    travelTime: "5:50",
    carts:[
        {number: 1, carType: "Купейный", price: 360},
        {number: 2, carType: "Купейный", price: 350},
        {number: 3, carType: "Купейный", price: 340},
        {number: 4, carType: "Купейный", price: 320},
        {number: 5, carType: "Купейный", price: 420},
        {number: 6, carType: "Купейный", price: 450}
        ]
    },{
    departTime: "16:10",
    arrivalTime: "21:35",
    travelTime: "5:25",
    carts:[
        {number: 1, carType: "Купейный", price: 360},
        {number: 2, carType: "Купейный", price: 350},
        {number: 3, carType: "Купейный", price: 340},
        {number: 4, carType: "Купейный", price: 320},
        {number: 5, carType: "Купейный", price: 420},
        {number: 6, carType: "Купейный", price: 450}
        ]
    },{
    departTime: "18:00",
    arrivalTime: "00:45",
    travelTime: "6:45",
    carts:[
        {number: 1, carType: "Купейный", price: 360},
        {number: 2, carType: "Купейный", price: 350},
        {number: 3, carType: "Купейный", price: 340},
        {number: 4, carType: "Купейный", price: 320},
        {number: 5, carType: "Купейный", price: 420},
        {number: 6, carType: "Купейный", price: 450}
        ]
    }]

    for (const travel of travels) {
        let ride = await createRide({
            date: req.date,
            depart: req.depart,
            arrival: req.arrival,
            departTime: travel.departTime,
            arrivalTime: travel.arrivalTime,
            travelTime: travel.travelTime,
            carts: travel.carts,
        })

        try {
            await ride.save()
            newRides.push(ride)
        } catch(err) { 
            res.status(400).json({message: err.message})
        }
    }
    console.log('new data generated')
    return newRides
    
/*
    {
        date: body.date,
        depart: body.depart,
        arrival: body.arrival,
        departTime: body.departTime,
        arrivalTime: body.arrivalTime,
        travelTime: body.travelTime,
        carts: body.carts,
    }
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
*/
}

module.exports = router