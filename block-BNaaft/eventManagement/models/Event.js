const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    summary : {
        type : String,
        required : true
    },
    host: {
        type : String,
        required : true
    },
    start_date : {
        type : Date,
        default : Date.now

    },
    end_date : {
        type : Date,
        default : Date.now
    },
    event_categories : {
        type : [String],
    },  
    location : String,
    likes : {
        type : Number,
        default : 0 
    },
    remarks : [
        {
            type : Schema.Types.ObjectId,
            ref: "Remark"
        }
    ]

}, {timestamps: true});

const Event = mongoose.model('Event',eventSchema);
module.exports = Event;