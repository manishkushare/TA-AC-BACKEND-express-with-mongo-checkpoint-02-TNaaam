const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const remarkSchema = new Schema({
    remark_title : {
        type : String,
        required : true
    },
    remark_author : {
        type : String,
        required : true
    },
    remark_likes : {
        type : Number,
        default : 0
    },
    event : {
        type : Schema.Types.ObjectId,
        ref : "Event"
    }

},{timestamps : true});

const Remark = mongoose.model('Remark',remarkSchema);
module.exports = Remark;