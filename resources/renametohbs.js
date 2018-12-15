const fs = require("fs");

for(var i=1;i<=56;i++){
    fs.rename(`./views/${i}.html`,`./views/${i}.hbs`,(err) => {
        if (err) throw err;
        console.log('Rename complete!');
      });
}