
let MODULE=function(mongoose){
let coll;
let root;
let defaults = {
    login_count: 0,
    is_loggedin: false,
    sections: {
        S1: false,
        S2: false,
        S3: false,
        S4: false,
        S5: false,
        S6: false,
        S7: false,
        S8: false,
        S9: false,
        S10: false,
        S11: false,
        S12: false,
        S13: false,
        S14: false,
        S16: false,
        S17: false,
        S18: false,
        S19: false,
        S20: false,
        S21: false,
        S22: false,
        S23: false,
        S24: false,
        S25: false,
        S26: false,
        S27: false,
        S28: false,
        S29: false,
        S30: false,
        S31: false,
        S32: false,
        S33: false,
        S34: false,
        S35: false,
        S36: false,
        S37: false,
        S38: false,
        S39: false,
        S40: false,
        S41: false,
        S42: false,
        S43: false,
        S44: false,
        S45: false,
        S46: false,
        S47: false,
        S48: false,
        S49: false,
        S50: false,
        S51: false,
        S52: false,
        S53: false,
        S54: false,
        S55: false,
        S56: false,
    }

}
    async function readDb(root, query, count) {

        let result;
        try {
            result = await (count ? root.find(query).count() : root.find(query).toArray());
        } catch (err) {
            throw err;
        }
        if (result === 0 && count) {
            return false;
        } else if (result && count) {
            return true;
        }
        return result;
    
    };
    
    
                
    
               
    
                async function findAndUpdate(root, filter, update, count) {
                    let result;
                    try {
                        result = await root.findOneAndUpdate(filter, {
                            $set: update
                        }, {
                            returnOriginal: false
                        });
                        console.log(result);
                    } catch (err) {
                        throw err;
                    }
                    return result.value;
                }

                
            function init(b) {
                coll = b;

                root = mongoose.connection.collection(coll);
                let read = readDb.bind(null, root);
                let update = findAndUpdate.bind(null, root);
                return {
                    read,
                    update
                };
            }

           

            return {
                init,
                defaults
            }
    
}






            module.exports = MODULE;