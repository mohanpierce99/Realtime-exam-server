(function () {
    var login = sel("#login");
    var signup = sel("#signup");
    var loginportion = sel("#loginportion");
    var signupportion = sel("#signupportion");
    
    

    login.addEventListener("click", () => {
        signupportion.classList.add("d-none","fadeOut");
        loginportion.classList.remove("fadeOut","d-none");
        loginportion.classList.add("fadeIn");
    });

    signup.addEventListener("click", () => {
        loginportion.classList.add("fadeOut","d-none");
        signupportion.classList.remove("fadeOut","d-none");
        signupportion.classList.add("fadeIn");
    });
    function sel(data) {
        return document.querySelector(data);
    }


    function httpreq(route,json){
        var http = new Promise((res,rej)=>{
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST',route,true);
            xhttp.setRequestHeader('Cookie',document.cookie);
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                      res(this.response);
                }
                else if(this.readyState===4 && this.status===404){
                    rej("error:file not found");
                }else if(this.readyState===4 && this.status===401){
                    rej(this.response);
                }
            };
                
            xhttp.setRequestHeader('Content-Type','application/json; charset=UTF-8');
            xhttp.send(json);
        });

        return http;
    }

})();