const mongoose = require('mongoose');

var student = mongoose.model("Students",{
    name:{
        type:String,
        trim:true,
        required:true,
        minlength:1
    },
    rollno:{
        type:Number,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    sec:{
        type:String,
        required:true
    },
    questions:{
        type:Object
    },
    time:{
        type:Number
    }
});

module.exports = {
    student
};