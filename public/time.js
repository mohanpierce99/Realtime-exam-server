//to be included in main.hbs
var eles,soda;
(function(){

    var socket = io();
  
     var seg=allocateAndreturn();
console.log(seg);
    document.querySelector("#submitbtn").addEventListener("click", (e) => {
        console.log(answersselected(seg));
        var answers=JSON.stringify({arr:answersselected(seg)});
        console.log(answers);
        httpreq('/verifyresult', answers).then((data) => {
            alert(data);
        });
    });
    var start = function (timeleft) {
        var func = (addTime) => {
            timeleft = timeleft +addTime;
        };
        var counter = 0;
        var div = document.querySelector('#div')
    
        function convert(s) {
            // console.log(s);
            var min = Math.floor(s / 60);
            var char = (min < 10) ? '0' + min.toString() : min.toString();
            var sec = Math.floor(s % 60);
            var sec1 = (sec < 10) ? '0' + sec.toString() : sec.toString();
            return char + ':' + sec1;
        }
    
        var interval = setInterval(function () {
            counter++;
            if ((timeleft - counter) === 0) {
                window.location.replace("http://www.google.com");
            }
            console.log(timeleft - counter);
            var s = convert(timeleft - counter);
            var p = `${s}`;
            div.innerHTML = p;
        }, 1000)
    
    
    
    
        return func;
    }
    
    socket.on('connect', function () {
        var st;
    
        socket.on('setDefaultTime', function (time) {
            console.log(time);
            st = start(time);
        });
    
        socket.on('addTime', function (eTime) {
            st(eTime);
        });
    
        socket.on('disconnect',function() {
            console.log('disconnected');
        });
    });
    
    // sel("#ro").addEventListener("click",function(){
    //     console.log(socket);
    //     socket.emit("sendTime",+sel('#lolz').value);
    // });
    // sel("#ro2").addEventListener("click",function(){
    //     console.log(socket);
    //     socket.emit("append",+sel('#lolz2').value);
    // });
   
//["S55":[]
 // [{section:"S55","s55":value}]

    function allocateAndreturn() {
        var i = 0;
        var inputele = document.querySelectorAll("input");
        var arr = [];
        var count = 0;
        var sec;
        var sec1;
        inputele.forEach((ele, i) => {


            var correct = ele;
            while (ele.id === null || ele.getAttribute("id") !== "exam-text") {
                ele = ele.parentElement;
            }
            if (ele.getAttribute("data-original") !== sec || count === 0) {
                eles=ele;
                count = 1;
                sec1 = ele.getAttribute("data-original");
                soda=sec1;
                console.log(ele);
				var temp = {};
				temp[sec1] = [];
                arr.push(temp);
            }
            sec = ele.getAttribute("data-original");
         
                     correct.id=sec+"Q"+count;
                console.log(arr[arr.length - 1]);
                
                arr[arr.length - 1][sec1].push(correct);

            count++;
        });
        return (arr);
    }
    function answersselected(arr){
        return arr.map((data)=>{var root=Object.keys(data)[0];
            var temp={section:root};
            for(stuff of data[root]){
                if (stuff.type === "checkbox" || stuff.type === "radio") {
                    temp[stuff.id]=stuff.checked;
                } else if (stuff.type === "text") {
                    temp[stuff.id]=stuff.value;
                }
            }
                         return temp;
                        });
    }

    function httpreq(route, json) {
        var http = new Promise((res, rej) => {
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST', route, true);
            xhttp.withCredentials = true;
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    res(this.response);
                } else if (this.readyState === 4 && this.status === 404) {
                    rej("error:file not found");
                } else if (this.readyState === 4 && this.status === 401) {
                    rej(this.response);
                }
            };

            xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhttp.send(json);
        });

        return http;
    }

    function sel(data){
        return document.querySelector(data);
    }
})();



