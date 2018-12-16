const {mongoose} = require('./db/mongoconnect.js');
const section = require('./db/models/section');

var root = mongoose.connection.collection('sections');
var model = mongoose.model("sections",section.schema);

for(var i=1;i<=56;i++){
    var newsection = new model({
        id:`S${i}`,
        html:`./../resources/views/${i}.hbs`,
        answers:{},
    });
    
    newsection.save().then((doc)=>{
        console.log("document is saved:",doc);
    },(err)=>{
        console.log("unable to save the document",err);
    });
}


