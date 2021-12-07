const { Schema, model, Collection } = require('mongoose');
const moment = require('moment');
const flightSchema = new Schema({
    id: { type: Number, index: 1, required: true },
    company: { type: String, required: true },
    depatrtureCity: { type: String, required: true },
    arrivalCity: { type: String, required: true },
    depatrtureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
}, { collection: 'flights' });

flightSchema.
    path('id')
    .validate(id => id >= 0, "Id must not me negative");

flightSchema.
    path('depatrtureTime')
    .validate(depatrtureTime => depatrtureTime > moment.now(), "Departure time must be in the furure");
flightSchema.
    path('arrivalTime')
    .validate(arrivalTime => arrivalTime > moment.now(), "Arrival time must be in the furure");
// flightSchema.
//     path('arrivalTime')
//     .validate((arrivalTime,depatrtureTime) => arrivalTime.isAfter(depatrtureTime),"Arrival time must be after departure");
const Flight = model('Flight', flightSchema);

module.exports = Flight;