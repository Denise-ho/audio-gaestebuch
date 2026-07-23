let recorder;
let audioChunks = [];

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const status = document.getElementById("status");

let adminClicks = 0;

// ---------------------------
// Aufnahme starten
// ---------------------------

startButton.onclick = async () => {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        recorder = new MediaRecorder(stream);

        audioChunks = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        recorder.onstart = () => {
            status.innerHTML = "🔴 Aufnahme läuft";
            startButton.disabled = true;
            stopButton.disabled = false;
        };

        recorder.onstop = async () => {

            const name =
                document.getElementById("name").value || "Unbekannt";

            const audioBlob = new Blob(audioChunks, {
                type: "audio/webm"
            });

            await saveRecording(name, audioBlob);

            stream.getTracks().forEach(track => track.stop());

            status.innerHTML =
                "❤️ Vielen Dank! Aufnahme gespeichert";

            startButton.disabled = false;
            stopButton.disabled = true;
        };

        recorder.start();

    } catch (error) {

        status.innerHTML =
            "❌ Mikrofon Fehler: " + error.message;

    }

};


// ---------------------------
// Aufnahme beenden
// ---------------------------

stopButton.onclick = () => {

    if (recorder && recorder.state === "recording") {
        recorder.stop();
    }

};


// ---------------------------
// Admin öffnen
// ---------------------------

function openAdmin() {

    adminClicks++;

    if (adminClicks < 5) {
        return;
    }

    adminClicks = 0;

    const pin = prompt("Admin PIN:");

    if (pin !== "2026") {
        alert("Falsche PIN");
        return;
    }

    document.getElementById("admin").style.display = "block";

    loadRecordings();

}


// ---------------------------
// Aufnahmen laden
// ---------------------------

function loadRecordings() {

    const transaction =
        db.transaction("aufnahmen", "readonly");

    const store =
        transaction.objectStore("aufnahmen");

    const request =
        store.getAll();

    request.onsuccess = () => {

        const recordings = request.result;

        document.getElementById("count").textContent =
            recordings.length;

        let html = "";

        recordings.forEach((item, index) => {

            html += `
                ${index + 1} - ${item.name}<br>
            `;

        });

        document.getElementById("list").innerHTML = html;

    };

}
// ---------------------------
// Aufnahmen herunterladen
// ---------------------------

document.getElementById("downloadAll").onclick = () => {

    const transaction = db.transaction(
        "aufnahmen",
        "readonly"
    );

    const store = transaction.objectStore(
        "aufnahmen"
    );

    const request = store.getAll();


    request.onsuccess = () => {

        const recordings = request.result;


        let index = 0;


        function downloadNext() {


            if (index >= recordings.length) {

                alert(
                    "Alle Aufnahmen wurden vorbereitet."
                );

                return;

            }


            const item = recordings[index];


            const url = URL.createObjectURL(
                item.audio
            );


            const link = document.createElement("a");

            link.href = url;

            link.download =
                String(index + 1).padStart(3, "0")
                + "_"
                + item.name
                + ".webm";


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);


            setTimeout(() => {

                URL.revokeObjectURL(url);

                index++;

                downloadNext();


            }, 1500);


        }


        downloadNext();


    };

};