const mongoose = require('mongoose');

var details = mongoose.model("detail",{
    dept:{
        type:String,
        required:true
    },
    sec:{
        type:String,
        required:true
    },
    batch:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});

module.exports={
    details
};