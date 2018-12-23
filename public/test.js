var socket = io();

(function () {
  
     var seg=allocateAndreturn();
    document.querySelector("#submitbtn").addEventListener("click", (e) => {
        var answers=JSON.stringify(answersselected(seg));
        httpreq('/verifyresult', answers).then((data) => {
            alert(data);
        });
    });

    sel("#ro").addEventListener("click",function(){
        console.log(socket);
        socket.emit("sendTime",+sel('#lolz').value);
    });

    sel("#ro2").addEventListener("click",function(){
        console.log(socket);
        socket.emit("append",+sel('#lolz2').value);
    });
    // function allocateAndreturn(){
    //     var i = 0;
    //     var inputele = document.querySelectorAll("input");
    //     var arr = [];
    //     var count = 0;
    //     var sec;
    //     inputele.forEach((ele, i) => {

    //         var correct = ele;
    //         while (ele.id === null || ele.getAttribute("id") !== "exam-text") {
    //             ele = ele.parentElement;
    //         }
    //         if (ele.getAttribute("data-original") !== sec || count === 0) {
    //             count = 1;
    //             arr.push({
    //                 section: ele.getAttribute("data-original")
    //             });
    //         }
    //         sec = ele.getAttribute("data-original");
    //         correct.id = (sec + "Q" + count);
    //         console.log(arr.length - 1);
    //         console.log(correct.value);
    //         if (correct.type === "checkbox" || correct.type === "radio") {
    //             arr[arr.length - 1][correct.id] = correct.checked;
    //         } else if (correct.type === "text") {
    //             arr[arr.length - 1][correct.id] = correct.value;
    //         }
    //         console.log(ele);
    //         count++;
    //     });
    //     return ({
    //         arr:arr
    //     });
    // }
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
            // 	console.log(ele);
            while (ele.id === null || ele.getAttribute("id") !== "exam-text") {
                ele = ele.parentElement;
            }
            if (ele.getAttribute("data-original") !== sec || count === 0) {
                count = 1;
                sec1 = ele.getAttribute("data-original")
				var temp = {};
				temp[sec1] = [];
                arr.push(temp);
            }
            sec = ele.getAttribute("data-original");
            //correct.id = (sec + "Q" + count);
            //console.log(arr.length - 1);
            //console.log(correct.value);
				console.log(arr[arr.length - 1])
                arr[arr.length - 1][sec1].push(correct);
            
            //console.log(ele);
            

            count++;
        });
        return (arr);
    }

    function answersselected(arr){
        arr.map((data)=>{var root=Object.keys(data)[0];
            var temp={section:root};
            for(stuff of data[root]){
               temp[stuff.id]=stuff.value;
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