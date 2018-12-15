const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
	//student
	id:{
		type: String,
		required: true,
		trim: true,
		},
	html:{
        type:String,
        required: true,

    },
    answers:{
        type:Object,
    }

});

const section = mongoose.model('students' , sectionSchema);

module.exports=section;