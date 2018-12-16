function pathgen(mongoose,hbs,paths,res){
    let root=mongoose.connection.collection("sections");
    let lib=require('./mongolib.js')(mongoose);
    let mansec=lib.init("sections");
    paths=paths||[".././../resources/views/1.hbs",".././../resources/views/2.hbs",".././../resources/views/3.hbs",".././../resources/views/4.hbs"];
    let n=0;


    hbs.registerHelper('cut',function clutch(data){
        var regex=/\d+/g;
            var usr=data.match(regex);
            let final;
            for(let i=0;i<2;i++){
    if(usr[i].length===1){usr[i]="0"+usr[i]};
                if(usr[i][1]==0){
                    data=data.replace(usr[i],"10");
                }else {
                    data=data.replace(usr[i],usr[i][1]);
                }usr=data.match(regex);
                final=+usr[i]+(n-1)*10;
                data=data.replace(usr[i],final);
            }
            return data;
    });

        mansec.readDb({id:data[0]}).then((data)=>{
            return genHTML(data,"",++n);
        }).then((data)=>{
           return mansec.readDb({id:data[1]}).then((pt)=>{
               return  genHTML(pt,data,++n);
            })
        }).then((data)=>{
            return mansec.readDb({id:data[2]}).then((pt)=>{
                return  genHTML(pt,data,++n);
             })
        }).then((data)=>{
            return mansec.readDb({id:data[1]}).then((pt)=>{
                return  genHTML(pt,data,++n);
             })
        }).then((data)=>{
            res.render(data);
        }).catch((err)=>{
            console.log(err);
            throw err;
        })
    

    
    
    
    
    
    function genHTML(path, datar,no) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
              let template=hbs.compile(data.toString());
              
              resolve(datar+template({section:no}));
            })
        });
    }

    function append(res){
        res.render(__dirname + "/views/layouts/main.hbs", {
            body: data
        });

    }
    }