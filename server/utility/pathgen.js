
// function pathgen(mongoose,paths,hbs,res){
//         let root=mongoose.connection.collection("sections");
//         let lib=require('../utility/mongolib.js')(mongoose);
//         let fs=require('fs');
//         let pathist=require('path');
//         let mansec=lib.init("sections");
//         paths=[".././../resources/views/52.hbs",".././../resources/views/53.hbs",".././../resources/views/54.hbs",".././../resources/views/29.hbs"];
//         let n=0;
    
    
//         hbs.registerHelper('cut',function clutch(data){
//             var regex=/\d+/g;
//                 var usr=data.match(regex);
//                 let final;
//                 for(let i=0;i<usr.length;i++){
//         if(usr[i].length===1){usr[i]="0"+usr[i]};
//                     if(usr[i][1]==0){
//                         data=data.replace(usr[i],"10");
//                     }else {
//                         data=data.replace(usr[i],usr[i][1]);
//                     }usr=data.match(regex);
//                     final=+usr[i]+(n-1)*10;
//                     data=data.replace(usr[i],final);
//                 }
//                 return data;
//         });
//         console.log("hey")
//             mansec.read({id:paths[0]}).then((data)=>{
            
//                 return genHTML(paths[0].substring(8),"",++n,paths[0]);
//             }).then((data)=>{
//                return mansec.read({id:paths[1]}).then((pt)=>{
//                    return  genHTML(paths[1].substring(8),data,++n,paths[1]);
//                 })
//             }).then((data)=>{
//                 return mansec.read({id:paths[2]}).then((pt)=>{
//                     return  genHTML(paths[2].substring(8),data,++n,paths[2]);
//                  })
//             }).then((data)=>{
//                 return mansec.read({id:paths[3]}).then((pt)=>{
//                     return  genHTML(paths[3].substring(8),data,++n,paths[3]);
//                  })
//             }).then((data)=>{
//                 console.log(data);
//                append(data);
//             }).catch((err)=>{
//                 console.log(err);
//                 throw err;
//             })
        
    
        
       
        
        
//         function genHTML(path, datar,no,orgno) {
//            path= pathist.join(__dirname+"../../../"+path);
//             return new Promise((resolve, reject) => {
//                 fs.readFile(path, function (err, data) {
//                     if (err) {
//                         reject(err);
//                         return;
//                     }
//                   let template=hbs.compile(data.toString());
                  
//                   resolve(datar+template({
    
//                       section:no,
//                       sectionorg:orgno
//                     }));
//                 })
//             });
//         }
    
//         function append(data){
//             res.render(pathist.join(__dirname+"../../../"+"/resources/views/master/main.hbs"), {
//                 body: data
//             });
    
//         }
//         }
//         module.exports=pathgen;


function pathgen(mongoose,paths,hbs,res,rollno,namer){
    console.log(rollno);
    let root=mongoose.connection.collection("sections");
    let lib=require('../utility/mongolib.js')(mongoose);
    let fs=require('fs');
    let pathist=require('path');
    let mansec=lib.init("sections");

    let n=0;


    hbs.registerHelper('cut',function clutch(data){
        var regex=/\d+/g;
            var usr=data.match(regex);
            let final;
            for(let i=0;i<usr.length;i++){
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
    console.log("hey")
        mansec.read({id:paths[0]}).then((data)=>{
           
            return genHTML(data[0].html.substring(4),"",++n,paths[0]);
        }).then((data)=>{
           return mansec.read({id:paths[1]}).then((pt)=>{
               return  genHTML(pt[0].html.substring(4),data,++n,paths[1]);
            })
        }).then((data)=>{
            return mansec.read({id:paths[2]}).then((pt)=>{
                return  genHTML(pt[0].html.substring(4),data,++n,paths[2]);
             })
        }).then((data)=>{
            return mansec.read({id:paths[3]}).then((pt)=>{
                return  genHTML(pt[0].html.substring(4),data,++n,paths[3]);
             })
        }).then((data)=>{
           append(data);
        }).catch((err)=>{
            console.log(err);
            throw err;
        })
    

    
    
    
        function genHTML(path, datar,no,orgno) {
            path= pathist.join(__dirname+"../../../"+path);
             return new Promise((resolve, reject) => {
                 fs.readFile(path, function (err, data) {
                     if (err) {
                         reject(err);
                         return;
                     }
                   let template=hbs.compile(data.toString());
                   
                   resolve(datar+template({
     
                       section:no,
                       sectionorg:orgno
                     }));
                 })
             });
         }
     
         function append(data){
             res.render(pathist.join(__dirname+"../../../"+"/resources/views/master/main.hbs"), {
                 body: data,
                 roll:rollno,
                 namer:namer
             });
     
         }
    }
    module.exports=pathgen;


