const { Schema, model, Collection } = require('mongoose');
const moment = require('moment');
const eventschema = new Schema({
    id: { type: Number, index: 1, required: true },
    userid: { type: String, required: true },
    eventname: { type: String, required: true },
    eventadress: { type: String, required: true },
    eventdate: { type: Date, required: true },
    eventcause: { type: String },
    eventnotes: {type: String }
}, { collection: 'events' });

eventschema.
    path('id')
    .validate(id => id >= 0, "Id must not me negative");

eventschema.
    path('eventdate')
    .validate(eventdate => eventdate > moment.now(), "Event time must be in the furure");
const Event = model('Event', eventschema);

module.exports = Event;