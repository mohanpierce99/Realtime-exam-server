var random = [];
(function(){
     
    sel("#randomizebtn").addEventListener("click",()=>{
        var min;//inclusive [
        var max;//exclusive )
        var rollno = sel("#rollno").value;
        console.log(rollno);
        var iddetails = {
            id: rollno,
        };
        httpreq('/unattempted',JSON.stringify(iddetails)).then((data)=>{
            falseArray = JSON.parse(data).falselist;
            console.log(falseArray);
            min = 0;
            max = falseArray.length;
            console.log(max);
            random = gen4(min,max);
            var result = [falseArray[random[0]],falseArray[random[1]],falseArray[random[2]],falseArray[random[3]]];
            console.log("Random Number Generated : ",
                result
                );
            httpreq('/updatesections',JSON.stringify({result,id:rollno})).then((data)=>{
                console.log("successfully updated");
            })
            .catch((err)=>{
                console.log("unable to update the sections");
            });
        });        
    });
    
    function gen4(min,max){
        random[0] = generate(min,max);
        do{
            random[1] = generate(min,max);
        }while(random[0] === random[1]);
        do{
            random[2] = generate(min,max);
        }while(random[2] === random[1] || random[2] === random[0]);
        do{
            random[3] = generate(min,max);
        }while(random[3] === random[2] || random[3] === random[1] || random[3] === random[0]);
        return random;
    };

    function generate(min,max){
        var random =Math.floor(Math.random() * (+max - +min)) + +min;
        return random;
    }
    function sel(data) {
        return document.querySelector(data);
    }

    function httpreq(route,json){
        var http = new Promise((res,rej)=>{
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST',route,true);
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



{

}
