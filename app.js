let recorder;
let audioChunks = [];

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const status = document.getElementById("status");


startButton.onclick = async () => {

try {

const stream = await navigator.mediaDevices.getUserMedia({
audio: true
});


recorder = new MediaRecorder(stream);

audioChunks = [];


recorder.ondataavailable = (event) => {

if(event.data.size > 0){

audioChunks.push(event.data);

}

};


recorder.onstart = () => {

status.innerHTML = "🔴 Aufnahme läuft";

startButton.disabled = true;

stopButton.disabled = false;

};


recorder.onstop = async () => {


let name =
document.getElementById("name").value;


let audioBlob =
new Blob(
audioChunks,
{
type:"audio/webm"
}
);



await saveRecording(
name,
audioBlob
);



stream.getTracks().forEach(track => track.stop());


status.innerHTML =
"❤️ Vielen Dank! Aufnahme gespeichert";


startButton.disabled = false;

stopButton.disabled = true;


};


startButton.disabled = false;

stopButton.disabled = true;


};


recorder.start();


}

catch(error){

status.innerHTML =
"❌ Mikrofon Fehler: " + error.message;

}


};



stopButton.onclick = () => {

alert("Stop Button gedrückt");


if(recorder && recorder.state === "recording"){

recorder.stop();

}

};
let adminClicks = 0;


function openAdmin(){


adminClicks++;


if(adminClicks >= 5){


let pin = prompt(
"Admin PIN:"
);


if(pin === "2026"){


document.getElementById("admin").style.display="block";


loadRecordings();


}
else{


alert("Falsche PIN");


}


adminClicks = 0;


}


}



function loadRecordings(){


let transaction =
db.transaction(
"aufnahmen",
"readonly"
);


let store =
transaction.objectStore(
"aufnahmen"
);



let request =
store.getAll();



request.onsuccess=function(){


let recordings =
request.result;



document.getElementById("count").innerHTML =
recordings.length;



let text="";


recordings.forEach((item,index)=>{


text +=
(index+1)
+
" - "
+
item.name
+
"<br>";


});



document.getElementById("list").innerHTML =
text;


};


}