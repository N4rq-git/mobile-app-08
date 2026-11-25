const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");
const bubble = document.getElementById("bubble");
const levelStatus = document.getElementById("levelStatus");

startButton.addEventListener("click", startSensor);
async function startSensor() {
    try {

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
    document.getElementById("beta").textContent =
        beta.toFixed(1) + "°";
    document.getElementById("gamma").textContent =
        gamma.toFixed(1) + "°";

    let x = gamma * 2;
    let y = beta * 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;
    if (distance > maxDistance) {
        x = x * maxDistance / distance;
        y = y * maxDistance / distance;
    }
    bubble.style.transform =
        `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    const isLevel =
        Math.abs(beta) <= 3 && Math.abs(gamma) <= 3;
    if (isLevel) {
        bubble.classList.add("level-ok");
        levelStatus.textContent = "水平状態：水平です";
    } else {
        bubble.classList.remove("level-ok");
        levelStatus.textContent = "水平状態：傾いています";
    }
    statusText.textContent = "センサー情報を取得しました";
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try{
            const registration = await navigator.serviceWorker.register("./sw.js");

            console.log("Service Workerを登録しました");
            console.log(registration.scope)
        } catch (error) {
            console.error("Service Workerの登録に失敗しました", error)
        }
    });
}