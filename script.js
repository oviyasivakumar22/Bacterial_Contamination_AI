const MODEL_URL =
    "https://teachablemachine.withgoogle.com/models/EjltShDBC/";

let model;
let cameraStream = null;

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const startButton = document.getElementById("startCamera");
const captureButton = document.getElementById("captureImage");
const statusText = document.getElementById("status");

// Load Teachable Machine model
async function loadModel() {
    try {
        statusText.textContent = "Loading AI model...";

        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);

        statusText.textContent = "AI model ready. Start the camera.";

        console.log("AI model loaded successfully.");

    } catch (error) {
        console.error(error);
        statusText.textContent = "Failed to load AI model.";
    }
}

// Start camera
startButton.addEventListener("click", async () => {

    try {

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" }
            },
            audio: false
        });

        video.srcObject = cameraStream;

        statusText.textContent =
            "Back camera active. Point it at the equipment.";

    } catch (error) {

        console.error(error);

        statusText.textContent =
            "Camera access failed. Please allow camera permission.";
    }
});

// Capture image and analyze
captureButton.addEventListener("click", async () => {

    if (!cameraStream) {
        statusText.textContent = "Start the camera first.";
        return;
    }

    if (!model) {
        statusText.textContent = "AI model is still loading.";
        return;
    }

    // Capture current camera frame
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

    // AI prediction
    const predictions = await model.predict(canvas);

    // Find highest prediction
    let highestPrediction = predictions[0];

    for (let i = 1; i < predictions.length; i++) {

        if (
            predictions[i].probability >
            highestPrediction.probability
        ) {
            highestPrediction = predictions[i];
        }
    }

    const className = highestPrediction.className;

    const confidence =
        (highestPrediction.probability * 100).toFixed(1);

    // Display result
    if (className.toUpperCase().includes("CONTAMINATED")) {

        statusText.innerHTML =
            "🔴 <strong>CONTAMINATED</strong><br>" +
            "AI Confidence: " +
            confidence +
            "%";

    } else {

        statusText.innerHTML =
            "🟢 <strong>CLEAN</strong><br>" +
            "AI Confidence: " +
            confidence +
            "%";
    }

    console.log(predictions);
});

// Load AI model when website opens
loadModel();
