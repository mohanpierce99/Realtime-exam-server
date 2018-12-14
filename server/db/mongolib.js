
let mongoose;

async function readDb(coll,query,count){
    let root=mongoose.collection(coll);let result;
try{
result= await (count?root.find(query).count():root.find(query).toArray());
}catch(err){
throw err;
}
return result;

};


async function findAndUpdate(coll,filter,query,count){
let root=mongoose.collection(coll);
root.findOneAndUpdate({})

}



function init(a){
    mongoose=a;
   return {
       readDb,findAndUpdate
   }
}



module.exports={init,defaults}

