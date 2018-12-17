function router(bundle) {
    let app = bundle.app;
    let cookieparse = bundle.cookie;
    let {mongoose} = bundle.mongoose;
    let Student = bundle.Student;
    let express = bundle.express;
    let bodyParser = bundle.bodyParser;
    let mongolib = bundle.mongolib(mongoose);
    let jwt = bundle.jwt;
    let jwtlib = bundle.jwtlib(jwt);
    let hbs = bundle.hbs;
    let randomsection = bundle.randomsection;
    let pathgen=bundle.pathgen;
    let resultify=bundle.resultify;

    /*--------------------------------------------------------*/
    let studColl = mongolib.init("students");
    let teacherPref = mongolib.init("teacherpref");
    let defaults = mongolib.defaults;

    app.use(express.static(__dirname + "./../public", {
        fallthrough: true
    }));
    /*-----------------------------------------------------------*/
    app.use(cookieparse());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());

    /*-----------------------------------------------------------*/
    
    /*-----------------------------------------------------*/

  

    app.post('/home', (req, res) => {
        let rollno = +req.body.id;
        var patharr;
        studColl.read({
            id: rollno
        }).then((data) => {
            if (!data.length) {
                res.status(401).send("Please Signup or enter Correct Register No");
                return;
            } else if (data[0].is_loggedin) {
                res.status(401).send("User already in session");
                return;
            }
            randomsection(mongoose, 'students', data[0]).then((path) => {
                    patharr=path;
                    console.log(path);
                    return jwtlib.generateJWT({
                        id: data[0].id,
                        path,

                    }, 'ssn');

                })
                .then((token) => {
                    console.log(token);
                    return studColl.update({
                        id: rollno
                    }, {
                        // is_loggedin: true,
                        token
                    })
                }).then((data) => {

                    res.cookie("auth-token", data.token, {
                        maxAge: 2400000
                    });
                    pathgen(mongoose,patharr,hbs,res);
                }).catch((err) => {
                    res.status(404).send("Something went wrong");
                });
        });
    });
    /*-----------------------------------------------------------*/

    app.post('/inspect', (req, res) => {

        console.log(`${req.cookies} is the users cookie that is stored`);
        res.send("Cookie read");
    });
    /*-----------------------------------------------------------*/

    app.get('/remove', (req, res) => {
        res.clearCookie("auth-token");
        res.send("Cookie cleared");
    });
    /*-----------------------------------------------------------*/

    app.post('/newuser', (req, res) => {
            let user = req.body;
            user.id = +user.id;
            var patharr;

            teacherPref.read({}, false).then((data) => {
                let mam = data[data.length - 1];
                delete mam._id;
                let mainObj = Object.assign(user, mam, defaults);
                return new Student(mainObj).save()
            }).then((data) => {
                randomsection(mongoose, 'students', data).then((path) => {
                    patharr=path;
                    return jwtlib.generateJWT({
                            id: data.id,
                            path,

                        }, 'ssn')
                        .then((token) => {
                            console.log(token);
                            return studColl.update({
                                id: data.id,
                            }, {
                                // is_loggedin: true,
                                token: token
                            })
                        }).then((data) => {

                            res.cookie("auth-token", data.token, {
                                maxAge: 2400000
                            });
                            pathgen(mongoose,patharr,hbs,res);
                        }).catch((err) => {
                            res.status(404).send("Something went wrong");
                        });


                });
            });

        });
        /*-----------------------------------------------------------*/

        app.post("/verifyresult",function(req,res){
           let user=req.body;
           var result=[];
           resultify(mongolib,user.arr[0]).then((data)=>{
               result.push(data);
               return resultify(mongolib,user.arr[1]);
           }).then((data)=>{
               result.push(data);
               return resultify(mongolib,user.arr[2]);
           }).then((data)=>{
            result.push(data);
            return resultify(mongolib,user.arr[3]);
           }).then((data)=>{
            res.json(result);
           }).catch((err)=>console.log(err));
        });

    }

    module.exports = router;