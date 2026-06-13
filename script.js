const startBtn = document.getElementById("startScan");
const hero = document.getElementById("hero");
const dashboard = document.getElementById("dashboard");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const scanStatus = document.getElementById("scanStatus");

const platform = document.getElementById("platform");
const browser = document.getElementById("browser");
const os = document.getElementById("os");
const language = document.getElementById("language");

const screenWidth = document.getElementById("screenWidth");
const screenHeight = document.getElementById("screenHeight");
const colorDepth = document.getElementById("colorDepth");
const timezone = document.getElementById("timezone");

const batteryLevel = document.getElementById("batteryLevel");
const batteryStatus = document.getElementById("batteryStatus");
const batterySaving = document.getElementById("batterySaving");

const connectionType = document.getElementById("connectionType");
const connectionSpeed = document.getElementById("connectionSpeed");
const networkStatus = document.getElementById("networkStatus");

const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const locationData = document.getElementById("locationData");

const scoreNumber = document.getElementById("scoreNumber");
const analysisText = document.getElementById("analysisText");

function detectBrowser() {
    const ua = navigator.userAgent;

    if (ua.includes("Edg")) return "Microsoft Edge";
    if (ua.includes("Chrome")) return "Google Chrome";
    if (ua.includes("Firefox")) return "Mozilla Firefox";
    if (ua.includes("Safari")) return "Safari";

    return "Unknown";
}

function detectOS() {
    const ua = navigator.userAgent;

    if (/Windows/i.test(ua)) return "Windows";
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Mac/i.test(ua)) return "macOS";
    if (/Linux/i.test(ua)) return "Linux";

    return "Unknown";
}

function animateScore(target) {
    let count = 0;

    const timer = setInterval(() => {
        count++;

        scoreNumber.textContent = count;

        if (count >= target) {
            clearInterval(timer);
        }
    }, 20);
}

async function getBatteryInfo() {
    if (!navigator.getBattery) {
        batteryLevel.textContent = "پشتیبانی نمی‌شود";
        batteryStatus.textContent = "-";
        batterySaving.textContent = "-";
        return;
    }

    const battery = await navigator.getBattery();

    batteryLevel.textContent =
        Math.round(battery.level * 100) + "%";

    batteryStatus.textContent =
        battery.charging ? "در حال شارژ" : "بدون شارژ";

    batterySaving.textContent =
        battery.level < 0.2 ? "فعال" : "غیرفعال";
}

function getConnectionInfo() {
    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (!connection) {
        connectionType.textContent = "نامشخص";
        connectionSpeed.textContent = "نامشخص";
        networkStatus.textContent = "فعال";
        return;
    }

    connectionType.textContent =
        connection.effectiveType || "نامشخص";

    connectionSpeed.textContent =
        connection.downlink
            ? connection.downlink + " Mbps"
            : "نامشخص";

    networkStatus.textContent =
        navigator.onLine ? "آنلاین" : "آفلاین";
}

function updateTime() {
    const now = new Date();

    currentDate.textContent =
        now.toLocaleDateString("fa-IR");

    currentTime.textContent =
        now.toLocaleTimeString("fa-IR");
}

function getLocation() {
    if (!navigator.geolocation) {
        locationData.textContent =
            "موقعیت مکانی پشتیبانی نمی‌شود";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude.toFixed(4);
            const lng = position.coords.longitude.toFixed(4);

            locationData.textContent =
                `${lat} , ${lng}`;
        },
        () => {
            locationData.textContent =
                "اجازه دسترسی داده نشد";
        }
    );
}

function fillDeviceInfo() {
    platform.textContent = navigator.platform;
    browser.textContent = detectBrowser();
    os.textContent = detectOS();
    language.textContent = navigator.language;

    screenWidth.textContent =
        screen.width + " px";

    screenHeight.textContent =
        screen.height + " px";

    colorDepth.textContent =
        screen.colorDepth + " bit";

    timezone.textContent =
        Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function generateAnalysis() {
    analysisText.innerHTML = `
    سیستم شما با موفقیت تحلیل شد.<br><br>

    مرورگر: ${detectBrowser()}<br>
    سیستم عامل: ${detectOS()}<br>
    وضعیت اتصال: ${navigator.onLine ? "عالی" : "ضعیف"}<br><br>

    دستگاه شما از عملکرد مناسبی برخوردار است و
    هیچ مشکل خاصی در تحلیل اولیه مشاهده نشد.
    `;
}

function startFakeScan() {
    const steps = [
        "در حال بررسی دستگاه...",
        "در حال شناسایی مرورگر...",
        "در حال تحلیل شبکه...",
        "در حال بررسی باتری...",
        "در حال پردازش اطلاعات...",
        "در حال تولید گزارش...",
        "اسکن کامل شد"
    ];

    let progress = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
        progress += 2;

        progressBar.style.width = progress + "%";
        progressPercent.textContent = progress + "%";

        if (
            progress % 15 === 0 &&
            stepIndex < steps.length
        ) {
            scanStatus.textContent =
                steps[stepIndex];

            stepIndex++;
        }

        if (progress >= 100) {
            clearInterval(interval);

            fillDeviceInfo();
            getBatteryInfo();
            getConnectionInfo();
            getLocation();
            generateAnalysis();

            animateScore(
                Math.floor(Math.random() * 15) + 85
            );
        }
    }, 70);
}

startBtn.addEventListener("click", () => {
    hero.style.display = "none";
    dashboard.classList.remove("hidden");

    fillDeviceInfo();
    updateTime();

    setInterval(updateTime, 1000);

    startFakeScan();
});
