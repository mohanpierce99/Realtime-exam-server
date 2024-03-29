function router(bundle) {
    let app = bundle.app;
    let cookieparse = bundle.cookie;
    let {
        mongoose
    } = bundle.mongoose;
    let Student = bundle.Student;
    let express = bundle.express;
    let bodyParser = bundle.bodyParser;
    let mongolib = bundle.mongolib(mongoose);
    let jwt = bundle.jwt;
    let jwtlib = bundle.jwtlib(jwt);
    let hbs = bundle.hbs;
    let randomsection = bundle.randomsection;
    let pathgen = bundle.pathgen;
    let resultify = bundle.resultify;

    /*--------------------------------------------------------*/
    let studColl = mongolib.init("students");
    let teacherPref = mongolib.init("teacherpref");
    let defaults = mongolib.defaults;

    app.use(cookieparse());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());


    app.use(express.static(__dirname + "./../public", {
        fallthrough: true
    }));

    app.use('/teachers',express.static(__dirname+"./../teacherinterface/public/"));
    /*-----------------------------------------------------------*/

    function checkCookie(req, res, next) {
        console.log("Hit");
        if ("auth-token" in (req.cookies)) {
            jwtlib.verifyJWT(req.cookies["auth-token"], 'ssn').then((data) => {
                pathgen(mongoose, data.path, hbs, res,data.id,data.name);
            })
        } else {
            next();
        }
    }

    function decode(req, res, next) {
        try {
            req.decodedStuff = jwtlib.verifySync(req.cookies["auth-token"], 'ssn');
        } catch (err) {
            res.status(401).send("Not Authorised");
        }
        next();

    }

    /*-----------------------------------------------------------*/

    /*-----------------------------------------------------*/



    app.post('/home', checkCookie, (req, res) => {
        let rollno = +req.body.id;
        let name;
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
            name=data[0].name;
            randomsection(mongoose, 'students', data[0]).then((path) => {
               
                    patharr = path;
                    console.log(path);
                    return jwtlib.generateJWT({
                        id: data[0].id,
                        name:data[0].name,
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
                    pathgen(mongoose, patharr, hbs, res,rollno,name);
                }).catch((err) => {
                    res.status(404).send("Something went wrong");
                });
        });
    });
    /*-----------------------------------------------------------*/

    // app.post('/inspect', (req, res) => {

    //     console.log(`${req.cookies} is the users cookie that is stored`);
    //     res.send("Cookie read");
    // });
    // /*-----------------------------------------------------------*/

    app.get('/remove', (req, res) => {
        res.clearCookie("auth-token");
        res.send("Cookie cleared");
    });
    /*-----------------------------------------------------------*/

    app.post('/newuser', checkCookie, (req, res) => {
        let user = req.body;
        let name;
        user.id = +user.id;
        var patharr;

        teacherPref.read({}, false).then((data) => {
            let mam = data[data.length - 1];
            delete mam._id;
            let mainObj = Object.assign(user, mam, defaults);
            return new Student(mainObj).save().catch((err)=>res("Already exists"));
        }).then((data) => {
            name=data.name;
            randomsection(mongoose, 'students', data).then((path) => {
                patharr = path;
                return jwtlib.generateJWT({
                        id: data.id,
                        path,
                        name:data.name

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
                        pathgen(mongoose, patharr, hbs, res,user.id,name);
                    }).catch((err) => {
                        res.status(404).send("Something went wrong");
                    });


            });
        });

    });
    /*-----------------------------------------------------------*/

    app.post("/verifyresult", decode, function (req, res) {
        let user = req.body;
        let userid = req.decodedStuff.id;
        var result = [];
        console.log(req.body);
        resultify.parseResult(mongolib, user.arr[0], userid).then((data) => {
            result.push(data);
            return resultify.parseResult(mongolib, user.arr[1], userid);
        }).then((data) => {
            result.push(data);
            return resultify.parseResult(mongolib, user.arr[2], userid);
        }).then((data) => {
            result.push(data);
            return resultify.parseResult(mongolib, user.arr[3], userid);
        }).then((data) => {
            result.push(data);
            resultify.finalDuty(result, userid, mongolib).then((data) => {
                result.push({
                    marks: data
                });
                res.json(result);
            }).catch((err) => res.status(400).send("Something went wrong"));


        });
    });
}


module.exports = router;