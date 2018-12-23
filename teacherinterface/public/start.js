(function () {
var socket=io();
    var batch = document.querySelector("#batch");
    var year = new Date().getFullYear();
    console.log(year);
    batch.value = year;
    batch.min = year - 4;
    batch.max = year;

//-------------------------------//

socket.on('connect',function(){
    console.log("Socket connection established");
    socket.emit('getCredentials');
    socket.on('userJoined',appenditem);
    
})

sel("#set").addEventListener("click",function(){
socket.emit("sendTime",Number(sel("#time").value)*60);
});








    //--------------------------//

    var appenditem = function (data) {
        var li = document.createElement("li");
        var pname = document.createElement("p");
        var proll = document.createElement("p");
        var pdate = document.createElement("p");
        var button = document.createElement("button");
        var label = document.createElement("label");
        document.querySelector(".logindetails").appendChild(li);
        li.appendChild(pname);
        li.appendChild(proll);
        li.appendChild(pdate);
        li.appendChild(label);
        li.appendChild(button);
        label.textContent = "online";
        label.style.color = "lightgreen";
        li.style.display = "flex";
        li.marginbottom = "5px";
        button.textContent = "addTime";
        button.setAttribute("class", "btn btn-info");
        pname.textContent = data.name;
        pdate.textContent = data.date;
        proll.textContent = data.rollno;
        pname.style.width = "30%";
        proll.style.width = "25%";
        pdate.style.width = "15%";
        button.style.with = "15%";
        label.style.width = "20%";

        label.setAttribute("id", `loginstatus${data.rollno}`);
        button.setAttribute("id", `addtime${data.rollno}`);

        button.addEventListener("click", () => {
            var result=prompt("Enter seconds to postpond");
          socket.emit('cherryPick',data.rollno,+result);
        });


    }


    var changestatus = function (rollno) {
        var status = document.querySelector(`#loginstatusof${rollno}`);
        var button = document.querySelector(`#addtimeof${rollno}`);
        button.setAttribute("disabled", "");
        status.textContent = "offline";
        status.style.color = "red";


    }


    var obj = {
        dept: "CSE",
        sec: "A",
        batch: "2018"
    };
    document.addEventListener("change", (data) => {
        console.log(data.target);
        if(data.target.id !== "time"){
            obj[data.target.id] = data.target.value;
        }
    });

   


    function sel(data) {
        return document.querySelector(data);
    }


})();