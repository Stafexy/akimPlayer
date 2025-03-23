//	mainScript.js

document.addEventListener("DOMContentLoaded", () => {
	// Находим все элементы с классом akim-player-container
	const playerContainers = document.querySelectorAll(".akim-player-container");

	// Перебираем найденные контейнеры
	playerContainers.forEach((container, index) => {
		// Создаем вложенный блок с классом audioPlayerX
		const audioPlayer = document.createElement("div");
		audioPlayer.className = `akim flexPlayer audioPlayer${index + 1} myFlex`;

		// Добавляем структуру внутрь audioPlayer
		audioPlayer.innerHTML = `
<div class="controls-container myFlex">
	<div class="playPauseBtn akimBtn circle akimHover"><svg class="playBtn cBtn" viewBox="-5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 30L10 55V5L50 30Z"/></svg><svg class="pausBtn cBtn" style="display:none" viewBox="-5 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5H25V55H10V5Z"/><path d="M35 5H50V55H35V5Z"/></svg></div>
	<div class="prevBtn akimBtn circle"><svg class="cBtn" viewBox="3 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 30L30 55V43L19.5 30L30 17V5L10 30Z"/><path d="M30 30L50 55V43L39.5 30L50 17V5L30 30Z"/></svg></div>
	<div class="nextBtn akimBtn circle"><svg class="cBtn" viewBox="-3 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 30L30 55V43L40.5 30L30 17V5L50 30Z"/><path d="M30 30L10 55V43L20.5 30L10 17V5L30 30Z"/></svg></div>
</div>
<div class="progress-container myFlex">
	<div class="progressBar akimBtn"><div class="progress" style="width: 0%;"></div></div>
	<div class="timeDisplay myFlex akimBtn"><span class="currentTime">00:00</span>/<span class="totalTime">00:00</span></div>
</div>
<div class="speed-container myFlex akimBtn"><span class="speedBtn">1.00</span></div>
<div class="volume-container myFlex">
	<div class="volumeBtn akimBtn circle"><svg class="vol1 cBtn" viewBox="3 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.7778 19.2857H10V40.7143H27.7778L50 55V5L27.7778 19.2857Z"/></svg><svg class="vol0 cBtn" style="display:none" viewBox="3 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="vol0ff" d="M27.7778 19.2857H10V40.7143H27.7778L50 55V5L27.7778 19.2857Z"/><path class="volOff" d="M15 5L50 55" stroke-width="5"/><path class="volOff" d="M50 5L15 55" stroke-width="5"/></svg></div>
	<div class="volumeBar akimBtn"><div class="volume" style="width: 50%;"></div></div>
</div>
		`;
		container.appendChild(audioPlayer);	// Добавляем созданный блок внутрь текущего контейнера
	});

	// Динамически подключаем скрипт control.js
	const controlScript = document.createElement("script");
	controlScript.src = "control.js";
	document.body.appendChild(controlScript);
});