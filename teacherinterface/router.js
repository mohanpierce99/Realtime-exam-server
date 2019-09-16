function router(bundle) {
    var jsonToCsv = require('json-to-csv-stream')
    var fs = require('fs')

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

    app.get('/downloadresults',(req,res)=>{

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

        var items = [
            { name: "Item 1", color: "Green", size: "X-Large" },
            { name: "Item 2", color: "Green", size: "X-Large" },
            { name: "Item 3", color: "Green", size: "X-Large" }];

            var jsonObject = JSON.stringify(items);


            fs.writeFile("./data.csv", ConvertToCSV(jsonObject), function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
                res.download("./data.csv")
            }); 

        

    })

//    app.get('/',(req,res)=>{
//        res.render('TeacherLogin.html');
//    });


    
    
    
}


module.exports = router;