function router(bundle) {
    let app = bundle.app;
    let {
        mongoose
    } = bundle.mongoose;
    let Student = bundle.Student;
    let express = bundle.express;
    let bodyParser = bundle.bodyParser;
    let randomsection = bundle.randomsection;

    app.use(express.static(__dirname + "./../public", {
        fallthrough: true
    }));

    

    app.use(bodyParser.json());
    app.get("/", (req, res) => {
        res.send('../public/index.html');
    });
    

    let defaults = {
        login_count: 0,
        is_loggedin: false,
        sections: {
            S1: false,
            S2: false,
            S3: false,
            S4: false,
            S5: false,
            S6: false,
            S7: false,
            S8: false,
            S9: false,
            S10: false,
            S11: false,
            S12: false,
            S13: false,
            S14: false,
            S15: false,
            S16: false,
            S17: false,
            S18: false,
            S19: false,
            S20: false,
            S21: false,
            S22: false,
            S23: false,
            S24: false,
            S25: false,
            S26: false,
            S27: false,
            S28: false,
            S29: false,
            S30: false,
            S31: false,
            S32: false,
            S33: false,
            S34: false,
            S35: false,
            S36: false,
            S37: false,
            S38: false,
            S39: false,
            S40: false,
            S41: false,
            S42: false,
            S43: false,
            S44: false,
            S45: false,
            S46: false,
            S47: false,
            S48: false,
            S49: false,
            S50: false,
            S51: false,
            S52: false,
            S53: false,
            S54: false,
            S55: false,
            S56: false,
        }

    }

    app.post('/secsel',(req,res)=>{
        //console.log(typeof randomsection);
        randomsection(mongoose,req.body).then((result)=>{
            console.log("result of selection:" , result);
        })
        .catch((err)=>{console.log(err);});
    });

    app.post('/unattempted' , (req,res) => {
        let user = req.body;
        user.id = Number(user.id);
        console.log(user.id);
        let root = mongoose.connection.db.collection('students');
        root.find({id:user.id}).count().then((count)=>{
            console.log(count);
            if(count === 0){
                console.log("wrong roll no");
            }
            else{
                console.log("else case");
                root.find({id:user.id}).toArray().then((data) => {
                    var sections = data[0].sections
                    //console.log(sections);
                    var seclist = Object.keys(sections);
                    var falselist = seclist.filter((object)=>{return sections[object]===false;});
                    console.log(falselist);
                    if(falselist.length<4){console.log("sections of question ran out")}
                    else res.send(JSON.stringify({falselist}));
                })
                .catch((err)=>{console.log(err);});
            }
        })
        // .catch((err)=>{
        //     console.log("couldnt call the count method in db");
        // });
    });

    app.post('/updatesections',(req,res)=>{
        console.log(req.body);
        let root = mongoose.connection.db.collection('students');
        root.find({
            id: Number(req.body.id)
        })
        .count()
        .then((count)=>{
            console.log(count);
            if (count === 0) {
                res.status(401).send("Error occured");
            } 
            else {
                let root = mongoose.connection.db.collection('students');
                root.find({id: Number(req.body.id)}).toArray().then((doc)=>{
                    var sec = doc[0].sections;
                    sec[String(req.body.result[0])] = true;
                    sec[String(req.body.result[1])] = true;
                    sec[String(req.body.result[2])] = true;
                    sec[String(req.body.result[3])] = true;
                    root.updateOne({
                        id: Number(req.body.id)
                    }, {
                        $set: {"sections":sec}
                    },{
                        returnOriginal:false
                    }).then((data) => res.send("Successfully updated sections")).catch((err) => res.status(404).send("Something went wrong"));
    
                });    
            }
        });
    });

    app.post('/login', (req, res) => {
        let rollno = +req.body.id;
        let root = mongoose.connection.db.collection('students');
        
        root.find({
            id: rollno
        }).count().then((count) => {
            if (count === 0) {
                res.status(401).send("Please Signup or enter Correct Register No");
            } else {
                root.updateOne({
                    id: rollno
                }, {
                    $set: {
                        is_loggedin: true
                    }
                }).then((data) => res.send("Successfully logged in")).catch((err) => res.status(404).send("Something went wrong"));
            }
        })

    });

    app.post('/register', (req, res) => {
        let user = req.body;
        user.id = Number(user.id);
        console.log(user.id);
        let root = mongoose.connection.db.collection('students');
        root.find({id:user.id}).count().then((count)=>{
            console.log(count);
            if(count === 0){
                mongoose.connection.db.collection("teacherpref").find({}).toArray().then((data) => {
                    let mam = data[data.length - 1];
                    delete mam._id;
                    let mainObj = Object.assign(defaults, mam, user);
        
                    new Student(mainObj).save().then((data) => {
                        res.send(data);
                    }).catch((err) => {
                        console.log(err);
                        res.status(400).send(err);
                    })
                }).catch((err) => log(err));
            }
            else{
                res.send("roll no already exist");
            }
        })
        .catch((err)=>{
            console.log("couldnt call the count method in db");
        });

        
    });
    
}

module.exports = router;

function log(d) {
    console.log(d);
}