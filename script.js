const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const startButton = document.getElementById("startCamera");
const captureButton = document.getElementById("captureImage");
const statusText = document.getElementById("status");

let cameraStream = null;

// Start the back camera
startButton.addEventListener("click", async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" }
            },
            audio: false
        });

        video.srcObject = cameraStream;

        statusText.textContent = "Back camera is active. Point it at the equipment.";

    } catch (error) {
        console.error(error);
        statusText.textContent =
            "Camera access failed. Please allow camera permission.";
    }
});

// Capture an image
captureButton.addEventListener("click", () => {
    if (!cameraStream) {
        statusText.textContent = "Start the camera first.";
        return;
    }

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

    const capturedImage = canvas.toDataURL("image/png");

    // Show captured image in the camera area
    const image = document.createElement("img");
    image.src = capturedImage;
    image.style.width = "100%";
    image.style.marginTop = "15px";
    image.style.borderRadius = "10px";

    document.querySelector(".camera-box").appendChild(image);

    statusText.textContent =
        "Image captured successfully. AI analysis will be connected next.";
});