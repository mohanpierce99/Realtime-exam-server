const fs = require("fs");
var audio;
var reg = /source src=\d\.mp3/g
for(var i=1;i<=56;i++){
    audio = `${i}.mp3`;
    var str = fs.readFileSync(`./section/${i}.html`).toString();
    // console.log(str);
    str = str.replace(reg,`source src="./../audio/${audio}"`)
    //fs.writeFileSync(`./section/${i}.html`,`<audio controls="" controlslist="nodownload"><source src=${audio} type="audio/mp3"> Your browser doesn't support audio teg!</audio>`+fs.readFileSync(`./section/${i}.html`))
    fs.writeFileSync(`./section/${i}.html`,str);

}