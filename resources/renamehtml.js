const fs = require("fs");

var id = 0;
for(var i=1;i<=14;i++){
    for(var j=1;j<=4;j++){
        console.log(id);
        id++;
        fs.rename(`./../public/audio/${i}.${j}.mp3`,`./../public/audio/${id}.mp3`,(err) => {
            if (err) throw err;
            console.log('Rename complete!');
          });
    }
}