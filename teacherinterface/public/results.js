(function(){
    var nitin ="hmm";
    var resultant = [];
    //{name: , roll: , date: } -- details
    var addstudcard = function(details){
        
        var pcards = document.querySelectorAll(".card");
        var maincard = pcards[pcards.length-1];
        var innerhtml = maincard.innerHTML;
        console.log(innerhtml);
        maincard.innerHTML = innerhtml + `<h1>${details}</h1>`;
    }
    


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