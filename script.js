const MODEL_URL =
    "https://teachablemachine.withgoogle.com/models/EjltShDBC/";

let model;
let cameraStream = null;

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");

const startButton = document.getElementById("startCamera");
const captureButton = document.getElementById("captureImage");
const retakeButton = document.getElementById("retake");

const statusText = document.getElementById("status");
const resultIcon = document.getElementById("resultIcon");
const treatmentText = document.getElementById("treatmentText");


// -----------------------------
// LOAD AI MODEL
// -----------------------------

async function loadModel() {

    try {

        statusText.textContent = "Loading AI model...";
        resultIcon.textContent = "⏳";

        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);

        statusText.textContent =
            "AI model ready. Start the camera.";

        resultIcon.textContent = "📷";

        console.log("AI model loaded successfully.");

    } catch (error) {

        console.error(error);

        statusText.textContent =
            "Failed to load AI model.";

        resultIcon.textContent = "⚠️";
    }
}


// -----------------------------
// START REAR CAMERA
// -----------------------------

startButton.addEventListener("click", async () => {

    try {

        cameraStream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: {
                    ideal: "environment"
                }
            },

            audio: false
        });

        video.srcObject = cameraStream;

        statusText.textContent =
            "Camera active. Point it at the equipment.";

        resultIcon.textContent = "📷";

    } catch (error) {

        console.error(error);

        statusText.textContent =
            "Camera access failed. Please allow camera permission.";

        resultIcon.textContent = "⚠️";
    }
});


// -----------------------------
// CAPTURE AND SCREEN
// -----------------------------

captureButton.addEventListener("click", async () => {

    if (!cameraStream) {

        statusText.textContent =
            "Start the camera first.";

        return;
    }

    if (!model) {

        statusText.textContent =
            "AI model is still loading.";

        return;
    }


    // Capture camera image

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    statusText.textContent =
        "Analyzing surface...";

    resultIcon.textContent = "🔍";


    // AI prediction

    const predictions =
        await model.predict(canvas);


    // Find highest prediction

    let highestPrediction =
        predictions[0];

    for (
        let i = 1;
        i < predictions.length;
        i++
    ) {

        if (
            predictions[i].probability >
            highestPrediction.probability
        ) {

            highestPrediction =
                predictions[i];
        }
    }


    const className =
        highestPrediction.className;

    const confidence =
        (
            highestPrediction.probability * 100
        ).toFixed(1);


    // -----------------------------
    // CONTAMINATED RESULT
    // -----------------------------

    if (
        className
            .toUpperCase()
            .includes("CONTAMINATED")
    ) {

        resultIcon.textContent = "🔴";

        statusText.innerHTML =
            "<strong>CONTAMINATED</strong><br>" +
            "AI Confidence: " +
            confidence +
            "%";


        treatmentText.innerHTML =
            "<strong>Contamination-associated signal detected.</strong><br><br>" +
            "Recommended Action:<br>" +
            "Enzyme–Silver Based Treatment<br><br>" +
            "Post-treatment verification recommended.";
    }


    // -----------------------------
    // CLEAN RESULT
    // -----------------------------

    else {

        resultIcon.textContent = "🟢";

        statusText.innerHTML =
            "<strong>CLEAN</strong><br>" +
            "AI Confidence: " +
            confidence +
            "%";


        treatmentText.innerHTML =
            "<strong>No contamination-associated signal detected.</strong><br><br>" +
            "No treatment recommendation from the screening module.";
    }


    console.log(predictions);
});


// -----------------------------
// RETAKE
// -----------------------------

retakeButton.addEventListener("click", () => {

    statusText.textContent =
        "Ready for another screening.";

    resultIcon.textContent = "📷";

    treatmentText.textContent =
        "Capture an equipment surface to begin screening.";
});


// -----------------------------
// LOAD MODEL
// -----------------------------

loadModel();
