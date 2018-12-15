const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
	//student
	id:{
		type: Number,
		minlength: 12,
		required: true,
		trim: true,
		unique: false
		},
	html:{
        type:String,
        required: true,

    },
    answers:{
        type:Object,
    }

});

const Section = mongoose.model('students' , sectionSchema);

module.exports=Section;