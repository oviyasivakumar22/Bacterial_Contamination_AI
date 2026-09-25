const homeNav = document.getElementById("homeNav");
const screenNav = document.getElementById("screenNav");
const historyNav = document.getElementById("historyNav");
const settingsNav = document.getElementById("settingsNav");

const startScreeningHome = document.getElementById("startScreeningHome");

const screeningCard = document.querySelector(".screening-card");

const navItems = [
    homeNav,
    screenNav,
    historyNav,
    settingsNav
];

function setActiveNav(selectedButton) {
    navItems.forEach(button => {
        if (button) {
            button.classList.remove("active");
        }
    });

    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}

homeNav.addEventListener("click", () => {
    setActiveNav(homeNav);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

screenNav.addEventListener("click", () => {
    setActiveNav(screenNav);

    if (screeningCard) {
        screeningCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});

startScreeningHome.addEventListener("click", () => {
    setActiveNav(screenNav);

    if (screeningCard) {
        screeningCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});

historyNav.addEventListener("click", () => {
    setActiveNav(historyNav);

    const historySection =
        document.getElementById("historySection");

    if (historySection) {
        historySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});
// Screening History Storage

const historyList =
    document.getElementById("historyList");

let screeningHistory =
    JSON.parse(localStorage.getItem("screeningHistory")) || [];

function displayHistory() {

    if (!historyList) return;

    if (screeningHistory.length === 0) {

        historyList.innerHTML =
            '<p class="empty-history">No screening records yet.</p>';

        return;
    }

    historyList.innerHTML = "";

    screeningHistory.forEach(record => {

        const item =
            document.createElement("div");

        item.className = "history-item";

        item.innerHTML =
    "<strong>" +
    record.result +
    "</strong>" +
    "<small>" +
    record.confidence +
    "</small>" +
    "<small>" +
    (record.method || "Method: Screening") +
    "</small>" +
    "<small>" +
    record.time +
    "</small>";
        historyList.appendChild(item);
    });
}

function addHistoryRecord(result, confidence, method = "Screening") {

    const record = {

        result: result,

        confidence:
            "AI Confidence: " +
            confidence +
            "%",

        method:
            "Method: " +
            method,

        time:
            new Date().toLocaleString()
    };

    screeningHistory.unshift(record);

    screeningHistory =
        screeningHistory.slice(0, 20);

    localStorage.setItem(
        "screeningHistory",
        JSON.stringify(screeningHistory)
    );

    displayHistory();
}