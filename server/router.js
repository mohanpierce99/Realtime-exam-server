function router(bundle) {
    let app = bundle.app;
    let cookieparse = bundle.cookie;
    let {mongoose} = bundle.mongoose;
    let Student = bundle.Student;
    let express = bundle.express;
    let bodyParser = bundle.bodyParser;
    let mongolib = bundle.mongolib(mongoose);
    let jwtlib = bundle.jwtlib;
    let hbs = bundle.hbs;

/*--------------------------------------------------------*/
    let studColl = mongolib.init("students");
    let teacherPref = mongolib.init("teacherpref");
    let defaults = mongolib.defaults;
    console.log(typeof jwtlib);

    app.use(express.static(__dirname + "./../public", {
        fallthrough: true
    }));
/*-----------------------------------------------------------*/
    app.use(cookieparse());
    app.use(bodyParser.json());
  
/*-----------------------------------------------------------*/
hbs.registerHelper('cut',function clutch(data){
    var regex=/\d+/g;var n=4;
        var usr=data.match(regex);
        let final;
        for(let i=0;i<2;i++){
if(usr[i].length===1){usr[i]="0"+usr[i]};
            if(usr[i][1]==0){
                data=data.replace(usr[i],"10");
            }else {
                data=data.replace(usr[i],usr[i][1]);console.log(data);
            }usr=data.match(regex);
            final=+usr[i]+(n-1)*10;
            data=data.replace(usr[i],final);
        }
        return data;
});
/*-----------------------------------------------------*/

    app.post('/login', (req, res) => {
        let rollno = +req.body.id;
        studColl.read({
            id: rollno
        }).then((data) => {
            if (!data.length) {
                res.status(401).send("Please Signup or enter Correct Register No");
                return;
            }else if(data[0].is_loggedin){
                res.send(401).send("User already in session");
                return;
            }
            return studColl.update({
                id: rollno
            }, {
                is_loggedin: true,
                
            })
        }).then((data) => {
            
            res.cookie("auth-token", `${rollno}`, {
                maxAge: 2400000
            });
            res.send("Successfully logged in");
        }).catch((err) => {
            res.status(404).send("Something went wrong");
        });
    })
/*-----------------------------------------------------------*/

    app.get('/inspect', (req, res) => {

        console.log(`${req.cookies} is the users cookie that is stored`);
        res.send("Cookie read");
    });
/*-----------------------------------------------------------*/

    app.get('/remove', (req, res) => {
        res.clearCookie("auth-token");
        res.send("Cookie cleared");
    });
/*-----------------------------------------------------------*/

    app.post('/register', (req, res) => {
        let user = req.body;
        user.id = +user.id;

        teacherPref.read({}, false).then((data) => {
            let mam = data[data.length - 1];
            delete mam._id;
            let mainObj = Object.assign(user, mam, defaults);
            return new Student(mainObj).save()
        }).then((data) => {
            res.send("Succesfully Registered");
        }).catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });

    });


/*-----------------------------------------------------------*/

}


module.exports = router;