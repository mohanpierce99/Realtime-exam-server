const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const salt = 'ssn';

const studentSchema = new mongoose.Schema({
	//student
	id:{
		type: Number,
		minlength: 12,
		required: true,
		trim: true,
		unique: true
		},
	name:{
       	type:String,
       	minlength:[3,"Too small"],
       	required:true,
       	trim :true
		},
	//---->ma'am
    batch:{
       	type:Number,
       	required:true
       	},
    department:{
    	type:String,
   	   	required:true
   		},
	class:{
   	   	type:String,
   	   	required:true
       	},
 	// till this<----
	login_count:{
		type:Number,
		validate:{
				validator:function(data){
					return !(data>12);
					},
				message:x=>"Span completed"
				},
			required:true
   		},
	is_loggedin:{
		type:Boolean,
        required:true
   		},
	sections:{
     	type:Object,
     	required:true
     	},
 	tokens:[{tkn:{
			type: String,
			}
		}]
});
		
studentSchema.methods.generateAuthToken = function (stdModel , st , arr) {
	let studnt = st.toObject();
	var tkn = jwt.sign({
		_id: studnt._id.toHexString(),
		arr
	},salt).toString();
	studnt.tokens.push({tkn});
	console.log(studnt);
	let x = new stdModel(studnt);
	return x.save().then(()=>{
		debugger;
		return tkn;
	},(e)=>{throw e})}

studentSchema.methods.removeToken = function (token) {
		let student = this;
		return student.updateOne({
			$pull: {
				tokens: {
					token: token,
				}
			}
		}); }




const Student = mongoose.model('students' , studentSchema);

module.exports=Student;