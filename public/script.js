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

    sel("#signupdiv").addEventListener("submit",(e)=>{
        e.preventDefault();
        register(e.target.elements.name,e.target.elements.rollno);
    });

    sel("#logindiv").addEventListener("submit",(e)=>{
        e.preventDefault();
        loginUp(e.target.elements.enrollno);
    })

    function loginUp(roll){
        let enroll={
            id:roll.value
        };
        console.log(enroll);
        httpreq("/login",JSON.stringify(enroll)).then((data)=>{
            console.log(data);
        }).catch(err=>console.log(err));
    }

     function register(name,rollno){
         let  usr={
            name:name.value,
            id:rollno.value
         }
         httpreq("/register",JSON.stringify(usr)).then((data)=>{
             alert(data);
         }).catch(err=>console.log(err));
     }

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