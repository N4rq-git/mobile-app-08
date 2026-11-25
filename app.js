const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");

startButton.addEventListener("click", startSensor);
async function startSensor() {
    try {
        // Device Orientation APIが利用可能か確認
        if (typeof DeviceOrientationEvent === "undefined") {
            statusText.textContent = "センサーAPIを利用できません";
            return;
        }

        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            const permission =
                await DeviceOrientationEvent.requestPermission();
            if (permission !== "granted") {
                statusText.textContent =
                    "センサーの利用が許可されませんでした";
                return;
            }
        }

        window.addEventListener(
            "deviceorientation",
            showOrientation
        );
        statusText.textContent = "センサー情報を取得しています";

        startButton.disabled = true;
    } catch (error) {
        statusText.textContent = "センサーの開始に失敗しました";
        console.error(error);
    }
}

function showOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    if (alpha === null || beta === null || gamma === null) {
        statusText.textContent = "センサーを取得できません"
        return
    }

    document.getElementById("alpha").textContent =
        alpha.toFixed(1) + "°";
    document.getElementById("beta").textContent =
        beta.toFixed(1) + "°";
    document.getElementById("gamma").textContent =
        gamma.toFixed(1) + "°";
    statusText.textContent = "センサー情報を取得しました";
}