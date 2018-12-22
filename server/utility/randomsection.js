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



var randomsection = (mongoose,coll, document) => {
    let root = mongoose.connection.collection(coll);

    return new Promise((res, rej) => {
        let user = document;
        user.id = Number(user.id);


        var sections = document.sections;
        var seclist = Object.keys(sections);
        var falseArray = seclist.filter((object) => {
            return sections[object] === false;
        });
        if (falseArray.length < 4) {
            rej("sections of question ran out");
            return;
        }
        random = gen4(0, falseArray.length);
        var result = [falseArray[random[0]], falseArray[random[1]], falseArray[random[2]], falseArray[random[3]]];

        sections[result[0] + ""] = true;
        sections[result[1] + ""] = true;
        sections[result[2] + ""] = true;
        sections[result[3] + ""] = true;
        root.updateOne({
            id: Number(user.id)
        }, {
            $set: {
                "sections": sections
            }
        }, {
            returnOriginal: false
        }).then((data) => {
            res(result)
        }).catch((err) => res.status(404).send("Something went wrong"));




    });


}






module.exports = randomsection;