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


recorder.onstop = () => {


stream.getTracks().forEach(track => track.stop());


status.innerHTML =
"❤️ Vielen Dank! Aufnahme beendet";


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