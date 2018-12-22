(function(){

    var obj = {};
   
    document.addEventListener("change",(data)=>{
        console.log(data.target);
        obj[data.target.id] = data.target.value;
        console.log(obj);
    });;
    var sec = sel("#sec");
    var batch = sel("#batch");
    var rural = sel("#rural");

    sel("#dropdownMenuButton").addEventListener("click",()=>{
        console.log("click");

    })
    

    function sel(data) {
        return document.querySelector(data);
    }

})();