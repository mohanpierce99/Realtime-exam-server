function router(bundle) {
    let app = bundle.app;
    let fs=require("fs");
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


    app.post("/teacherInterface",(req,res)=>{
        console.log(req.body);
      if(+req.body.pwd===12345){
          fs.createReadStream("./../public/testing.html").pipe(res);
      }else{
          res.send("Invalid password ! Please try again");
      }
    });
    /*-----------------------------------------------------------*/

    function checkCookie(req, res, next) {
        console.log("Hit");
        console.log(req.cookies);
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
            let logincount=data[0].login_count;
            console.log("user logging in for "+logincount+" time ");
            if (!data.length) {
                res.status(401).send("Please Signup or enter Correct Register No");
                return;
            } else if (data[0].is_loggedin) {
                res.status(401).send("User already in session");
                return;
            }
            else if(logincount==8){
                res.status(401).send("You have attended all the tests");
                return;
            }
            studColl.
            name=data[0].name;

            randomsection(mongoose, 'students', data[0]).then((path) => {
                console.log("<-----=-------->")
               console.log(path);
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
                        is_loggedin: true,
                        token,
                        login_count:logincount+1
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
            return new Student(mainObj).save().catch((err)=>res.send("Already exists"));
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

    app.post("/teacherpref",(req,res)=>{
        teacherPref.update({
            "access": "12345"
        }, {
           batch:req.body.batch,
           department:req.body.department,
           class:req.body.class
        }).then(()=>{
           res("Session created");
        }).catch(()=>{
            res("Session failed ! Please try again");

        });
    });


    app.post('/downloadresults',(req,res)=>{
console.log("Server hit");
        function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }

        teacherPref.read({}, false).then((data) => {
            
            let mam = data[data.length - 1];
            console.log(mam.batch);
            console.log(mam.department);
            console.log(mam.class);
             return studColl.read({
                batch:mam.batch,
                department:mam.department,
                class:mam.class
            })

        }).then((data)=>{
            data=data.map((x)=>{
                x.marks=x.marks.join(",") || "No tests attended yet";

                return {"name":x.name,"id":x.id,"batch":x.batch,"department":x.department,"class":x.class,"logincount":x.login_count,"marks":x.marks};
            })

            var jsonObject = JSON.stringify(data);
 

            fs.writeFile("./data.csv", ConvertToCSV(jsonObject), function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
                res.download("./data.csv")
            }); 

        })


       

            

        

    });




}


module.exports = router;