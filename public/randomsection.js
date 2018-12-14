var randomsection = (mongoose, document) => {

    function gen4(min, max) {
        var random = [];
        random[0] = generate(min, max);
        do {
            random[1] = generate(min, max);
        } while (random[0] === random[1]);
        do {
            random[2] = generate(min, max);
        } while (random[2] === random[1] || random[2] === random[0]);
        do {
            random[3] = generate(min, max);
        } while (random[3] === random[2] || random[3] === random[1] || random[3] === random[0]);
        return random;
    };

    function generate(min, max) {
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        return random;
    }

    var results = new Promise((res, rej) => {
        var min; //inclusive [
        var max; //exclusive )
        let user = document;
        user.id = Number(user.id);
        //console.log(user.id);
        let root = mongoose.connection.db.collection('students');
        root.find({
            id: user.id
        }).count().then((count) => {
            console.log(count);
            if (count === 0) {
                console.log("wrong roll no");
            } else {
                //console.log("else case");
                root.find({
                        id: user.id
                    }).toArray().then((data) => {
                        var sections = data[0].sections
                        //console.log(sections);
                        var seclist = Object.keys(sections);
                        var falseArray = seclist.filter((object) => {
                            return sections[object] === false;
                        });
                        //console.log(falseArray);
                        if (falseArray.length < 4) {
                            console.log("sections of question ran out")
                        } else {
                            min=0;
                            max=falseArray.length;
                            random = gen4(min, max);
                            var result = [falseArray[random[0]], falseArray[random[1]], falseArray[random[2]], falseArray[random[3]]];
                            // console.log("Random Number Generated : ",
                            //     result
                            // );
                            //console.log("user:",user);
                            
                            //////////////////////////////////
                            root.find({
                                id: user.id
                            })
                            .count()
                            .then((count)=>{
                                console.log(count);
                                if (count === 0) {
                                    res.status(401).send("Error occured");
                                } 
                                else {
                                    let root = mongoose.connection.db.collection('students');
                                    root.find({id: Number(user.id)}).toArray().then((doc)=>{
                                        var sec = doc[0].sections;
                                        sec[String(result[0])] = true;
                                        sec[String(result[1])] = true;
                                        sec[String(result[2])] = true;
                                        sec[String(result[3])] = true;
                                        root.updateOne({
                                            id: Number(user.id)
                                        }, {
                                            $set: {"sections":sec}
                                        },{
                                            returnOriginal:false
                                        }).then((data) => {
                                            console.log("Successfully updated sections")
                                            res(result)   
                                        }).catch((err) => res.status(404).send("Something went wrong"));
                        
                                    });    
                                }
                            });



                        }
                    })
                    .catch((err) => {
                        rej(err);
                    });
            }
        })
    })
    return results;
}

module.exports = randomsection;