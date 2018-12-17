(function () {

    document.querySelector("#submitbtn").addEventListener("click", (e) => {
        var answers=JSON.stringify(answersselected());
        httpreq('/verifyresult', answers).then((data) => {
            alert(data);
        });
    });

    function answersselected() {
        var i = 0;
        var inputele = document.querySelectorAll("input");
        var arr = [];
        var count = 0;
        var sec;
        inputele.forEach((ele, i) => {


            var correct = ele;
            // 	console.log(ele);
            while (ele.id === null || ele.getAttribute("id") !== "exam-text") {
                ele = ele.parentElement;
            }
            if (ele.getAttribute("data-original") !== sec || count === 0) {
                count = 1;
                arr.push({
                    section: ele.getAttribute("data-original")
                });
            }
            sec = ele.getAttribute("data-original");
            correct.id = (sec + "Q" + count);
            console.log(arr.length - 1);
            console.log(correct.value);
            if (correct.type === "checkbox" || correct.type === "radio") {
                arr[arr.length - 1][correct.id] = correct.checked;
            } else if (correct.type === "text") {
                arr[arr.length - 1][correct.id] = correct.value;
            }
            console.log(ele);
            count++;
        });
        return ({
            arr:arr
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
})();