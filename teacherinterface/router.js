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



    app.use(express.static(__dirname + "./public", {
        fallthrough: true
    }));
    /*-----------------------------------------------------------*/


//    app.get('/',(req,res)=>{
//        res.render('TeacherLogin.html');
//    });


    
    
    
}


module.exports = router;