function analyze(god, user, parent) {
    console.log("userjh");
    return user.reduce((acc, data) => {
        if (!(data in god)) {
            acc[data] = false;
            return acc;
        }
        if(typeof parent[data]=="boolean"){
           acc[data]=(god[data]===parent[data]);
           return acc;
        }
        if (god[data].includes(parent[data])) {
            acc[data] = true;
        } else {
            acc[data] = false;
        }
        return acc;
    }, {});

}

function parseResult(mongolib, data) {
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

function truncate(doc) {
    return Object.keys(doc).slice(1);
}



module.exports=parseResult;