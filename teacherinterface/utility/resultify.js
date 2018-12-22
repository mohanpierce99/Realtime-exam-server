function analyze(god, user, parent) {
   return user.reduce((acc, data) => {
        if (!(data in god)) {
            acc[data] = false;
            return acc;
        }
        if(typeof parent[data]=="boolean"){
           acc[data]=(god[data]===parent[data]);
           return acc;
        }
        let ci=god[data].map(data=>data.toLowerCase());
        if (ci.includes(parent[data].toLowerCase())) {
            acc[data] = true;
        } else {
            acc[data] = false;
        }
        return acc;
    }, {});
 

}

function parseResult(mongolib, data,uid) {
    let sections = mongolib.init("sections");
    let usersec = data.section;
   return sections.read({
        id: usersec
    }).then((god) => {
        let correctans = god[0].answers;
        let userkeys = truncate(data);
        return analyze(correctans, userkeys, data);
    }).catch(err => console.log(err));
}

function calc(a){
    var result=Object.keys(a).filter((data)=>a[data]===true).length;
    return result;
}

function truncate(doc) {
    return Object.keys(doc).slice(1);
}

function finalDuty(result,uid,mongolib){
var mylib=mongolib.init("students");
var totalMarks=0;let temp;
result.forEach((docker)=>{
 temp=calc(docker);totalMarks+=temp;  
})

return mylib.read({id:uid}).then((data)=>{
    let userstuff=data[0];
data[0].marks.push(totalMarks);
return mylib.update({id:uid},{marks:userstuff.marks}).then(()=>totalMarks);
});
}



module.exports={
    parseResult,
    finalDuty
}