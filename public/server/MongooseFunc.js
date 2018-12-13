const {mongoose} = require('./db/mongoose');
const {student} = require('./models/Student');
const {details} = require('./models/Class');

var addToClass = (obj)=>{
    //create a new instance of the module
	var newClass = new details(obj);
	//save it to the db
	newClass.save().then((doc)=>{
        console.log("document is saved:",doc);
	},(err)=>{
		console.log("unable to save the document");
	});

}

module.exports = {
    addToClass,
}