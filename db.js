let db;


const request = indexedDB.open(
"AudioGaestebuch",
1
);


request.onupgradeneeded = function(event){


db = event.target.result;


db.createObjectStore(
"aufnahmen",
{
keyPath:"id",
autoIncrement:true
}
);


};



request.onsuccess = function(event){

db = event.target.result;

};



function saveRecording(name, audioBlob){


return new Promise((resolve)=>{


let transaction =
db.transaction(
"aufnahmen",
"readwrite"
);


let store =
transaction.objectStore(
"aufnahmen"
);



store.add({

name:name,

datum:new Date(),

audio:audioBlob

});



transaction.oncomplete=function(){

resolve();

};


});


}