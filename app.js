let recorder;
let audioChunks = [];

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const status = document.getElementById("status");


startButton.onclick = async function(){


try {


let stream = await navigator.mediaDevices.getUserMedia({
audio:true
});


recorder = new MediaRecorder(stream);


audioChunks = [];


recorder.ondataavailable = function(event){

audioChunks.push(event.data);

};


recorder.onstart = function(){

status.innerHTML = "🔴 Aufnahme läuft";

startButton.disabled = true;

stopButton.disabled = false;

};



recorder.start();


setTimeout(function(){

if(recorder && recorder.state === "recording"){

recorder.stop();

}

},120000);


}

catch(error){

status.innerHTML =
"❌ Mikrofon Fehler: " + error.message;

}


};



stopButton.onclick = function(){


if(recorder && recorder.state === "recording"){

recorder.stop();

}


};



recorder.onstop = function(){


status.innerHTML =
"❤️ Vielen Dank! Aufnahme beendet";


startButton.disabled = false;

stopButton.disabled = true;


};