function router(bundle) {
    let app = bundle.app;
    let {
        mongoose
    } = bundle.mongoose;
    let Student = bundle.Student;
    let express = bundle.express;
    let bodyParser = bundle.bodyParser;

    app.use(express.static(__dirname + "./../public", {
        fallthrough: true
    }));
    app.use(bodyParser.json());
    app.get("/", (req, res) => {
        res.send('../public/index.html');
    })

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

    app.post('/login', (req,res)=>{
        let rollno = +req.body.id;
            Student.findOneAndUpdate(
                    {id: rollno},
                    {$set: {is_loggedin: true}},
                    {new: true}
                ).then((student) =>{ 
                    return student.generateAuthToken(Student,student,[1,2,3,4,5]);
                }).then((token)=>{
                    console.log(token);
                    res.send(token);
                })
                .catch((err) => res.status(404).send("Something went wrong"));
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