const MODEL_URL =
    "https://teachablemachine.withgoogle.com/models/EjltShDBC/";

let model;
let cameraStream = null;

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");

const startButton =
    document.getElementById("startCamera");

const captureButton =
    document.getElementById("captureImage");

const statusText =
    document.getElementById("status");

const resultIcon =
    document.getElementById("resultIcon");

const recommendation =
    document.getElementById("recommendation");
    document.getElementById("captureImage");


// Load the Teachable Machine model
async function loadModel() {

    try {

        statusText.textContent =
            "Loading AI model...";

        const modelURL =
            MODEL_URL + "model.json";

        const metadataURL =
            MODEL_URL + "metadata.json";

        model = await tmImage.load(
            modelURL,
            metadataURL
        );

        statusText.textContent =
            "AI model ready. Start the camera.";

        console.log(
            "AI model loaded successfully."
        );

    } catch (error) {

        console.error(error);

        statusText.textContent =
            "Failed to load AI model.";
    }
}


// Start the rear camera
startButton.addEventListener(
    "click",
    async () => {

        try {

            cameraStream =
                await navigator.mediaDevices
                    .getUserMedia({

                        video: {
                            facingMode: {
                                ideal: "environment"
                            }
                        },

                        audio: false
                    });

            video.srcObject =
                cameraStream;

            statusText.textContent =
                "Back camera active. Point it at the equipment.";

        } catch (error) {

            console.error(error);

            statusText.textContent =
                "Camera access failed. Please allow camera permission.";
        }
    }
);


// Capture image and analyze it
captureButton.addEventListener(
    "click",
    async () => {

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


        // Capture current camera frame
        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;

        const context =
            canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Ask the AI model for prediction
        const predictions =
            await model.predict(canvas);


        // Find the class with highest confidence
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
                highestPrediction.probability *
                100
            ).toFixed(1);


        // Display result
        // Display professional result
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

    recommendation.textContent =
        "Contamination-associated visual signal detected. " +
        "Clean the equipment surface and perform re-screening.";

    // Save result to History
    if (typeof addHistoryRecord === "function") {
        addHistoryRecord(
    "🔴 CONTAMINATED",
    confidence,
    "Camera"
);
    }

} else {

    resultIcon.textContent = "🟢";

    statusText.innerHTML =
        "<strong>CLEAN</strong><br>" +
        "AI Confidence: " +
        confidence +
        "%";

    recommendation.textContent =
        "No contamination-associated visual signal detected. " +
        "Continue with the normal screening workflow.";

    // Save result to History
    if (typeof addHistoryRecord === "function") {
       addHistoryRecord(
    "🔴 CONTAMINATED",
    confidence,
    "Camera"
);
    }
}
if (typeof addHistoryRecord === "function") {
    addHistoryRecord(
        className
            .toUpperCase()
            .includes("CONTAMINATED")
            ? "🔴 CONTAMINATED"
            : "🟢 CLEAN",
        confidence
    );
}
        console.log(predictions);
    }
);


// Start loading the model
loadModel();
// Upload Photo Screening

// Upload Photo Screening

const imageUpload = document.getElementById("imageUpload");
const uploadScreenButton = document.getElementById("uploadScreenButton");

uploadScreenButton.addEventListener("click", async () => {

    if (!model) {
        statusText.textContent = "AI model is still loading.";
        return;
    }

    if (imageUpload.files.length === 0) {
        statusText.textContent = "Please select an image first.";
        return;
    }

    const file = imageUpload.files[0];

    const image = document.createElement("img");

    image.onload = async () => {

        try {

            statusText.textContent = "Analyzing uploaded image...";

            // Resize image to a standard size before prediction
            const size = 224;

            const canvasUpload = document.createElement("canvas");
            canvasUpload.width = size;
            canvasUpload.height = size;

            const ctx = canvasUpload.getContext("2d");

            ctx.drawImage(
                image,
                0,
                0,
                size,
                size
            );

            const predictions =
                await model.predict(canvasUpload);

            let cleanProbability = 0;
            let contaminatedProbability = 0;

            predictions.forEach(prediction => {

                const name =
                    prediction.className.toUpperCase();

                if (name === "CLEAN") {
                    cleanProbability =
                        prediction.probability;
                }

                if (name === "CONTAMINATED") {
                    contaminatedProbability =
                        prediction.probability;
                }

            });

            const cleanPercent =
                (cleanProbability * 100).toFixed(1);

            const contaminatedPercent =
                (contaminatedProbability * 100).toFixed(1);

           if (
    contaminatedProbability >
    cleanProbability
) {

    statusText.innerHTML =
        "🔴 <strong>CONTAMINATED</strong><br>" +
        "AI Confidence: " +
        contaminatedPercent +
        "%";

    if (typeof addHistoryRecord === "function") {
    addHistoryRecord(
        "🔴 CONTAMINATED",
        contaminatedPercent,
        "Uploaded Image"
    );
}

} else {

    statusText.innerHTML =
        "🟢 <strong>CLEAN</strong><br>" +
        "AI Confidence: " +
        cleanPercent +
        "%";

    if (typeof addHistoryRecord === "function") {
    addHistoryRecord(
        "🟢 CLEAN",
        cleanPercent,
        "Uploaded Image"
    );
}

}
            console.log(
                "CLEAN:",
                cleanPercent + "%",
                "CONTAMINATED:",
                contaminatedPercent + "%"
            );

        } catch (error) {

            console.error(error);

            statusText.textContent =
                "Unable to analyze the uploaded image.";

        }
    };

    image.onerror = () => {

        statusText.textContent =
            "Unable to load the selected image.";

    };

    image.src = URL.createObjectURL(file);

});