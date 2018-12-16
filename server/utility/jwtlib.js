function JWTlib(jwt){
    function generateJWT( payload, pass) {
        return new Promise((res, rej) => {
                    try {
                        res(jwt.sign(payload, pass, {
                            expiresIn: 2400
                        }));
                    } catch (err) {
                        rej(err);
                    }
    
                });
            }
    
                function verifyJWT(token, pass) {
                    return new Promise((res, rej) => {
                        try {
                            res(jwt.verify(token, pass));
                        } catch (err) {
                            rej(err);
                        }
                    });
                }
    
                function revive( token) {
                    return new Promise((res, rej) => {
                        try {
                            return jwt.decode(token);
                        } catch (err) {
                            rej(err);
                        }
                    });
                }
    

                return {
                    generateJWT,verifyJWT,revive
                }
}
module.exports=JWTlib;