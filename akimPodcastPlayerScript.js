document.addEventListener("DOMContentLoaded", () => {
    const codeVersion = "1.0.33"; // Обновлённая версия кода: изменения в стилях и логике
    console.log(`Podcast Player Script Version: ${codeVersion}`);

    const playerContainers = document.querySelectorAll(".akim-player-container");

    function createAudioPlayerHTML() {
        return `
            <div class="controls-container myFlex">
                <div class="playPauseBtn akimBtn circle akimHover">
                    <svg class="playBtn cBtn" viewBox="-5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 30L10 55V5L50 30Z"/></svg>
                    <svg class="pausBtn cBtn" style="display:none" viewBox="-5 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5H25V55H10V5Z"/><path d="M35 5H50V55H35V5Z"/></svg></div>
                <div class="prevBtn akimBtn circle"><svg class="cBtn" viewBox="5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 30L30 55V43L19.5 30L30 17V5L10 30Z"/><path d="M30 30L50 55V43L39.5 30L50 17V5L30 30Z"/></svg></div>
                <div class="nextBtn akimBtn circle"><svg class="cBtn" viewBox="-5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 30L30 55V43L40.5 30L30 17V5L50 30Z"/><path d="M30 30L10 55V43L20.5 30L10 17V5L30 30Z"/></svg></div>
            </div>
            <div class="progress-container myFlex">
                <div class="progressBar akimBtn"><div class="progress" style="width: 0%;"></div></div>
                <div class="timeDisplay myFlex akimBtn"><span class="currentTime">00:00</span>/<span class="totalTime">00:00</span></div>
                <div class="speed-container myFlex akimBtn"><span class="speedBtn">1.00</span></div>
            </div>
            <div class="volume-container myFlex">
                <div class="volumeBtn akimBtn circle">
                    <svg class="vol1 cBtn" viewBox="5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.7778 19.2857H10V40.7143H27.7778L50 55V5L27.7778 19.2857Z"/></svg>
                    <svg class="vol0 cBtn" style="display:none" viewBox="5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="vol0ff" d="M27.7778 19.2857H10V40.7143H27.7778L50 55V5L27.7778 19.2857Z"/><path class="volOff" d="M15 5L50 55" stroke-width="5"/><path class="volOff" d="M50 5L15 55" stroke-width="5"/></svg>
                </div>
                <div class="volumeBar akimBtn"><div class="volume" style="width: 50%;"></div></div>
            </div>
        `;
    }

    playerContainers.forEach((player, index) => {
        const audioSrc = player.getAttribute("audio");
        if (!audioSrc) {return;}

        const jumpTime = parseInt(player.getAttribute("jump")) || 10;

        const audio = document.createElement("audio");
        audio.src = audioSrc;
        audio.className = "tracks";
        audio.volume = 0.5; // Устанавливаем громкость на 50% изначально
        player.appendChild(audio);

        const audioPlayer = document.createElement("div");
        audioPlayer.className = `akim flexPlayer audioPlayer${index + 1} myFlex`;
        audioPlayer.innerHTML = createAudioPlayerHTML();
        player.appendChild(audioPlayer);

        const playPauseBtn = player.querySelector(".playPauseBtn"),
            playIcon = playPauseBtn?.querySelector(".playBtn"),
            pauseIcon = playPauseBtn?.querySelector(".pausBtn"),
            prevBtn = player.querySelector(".prevBtn"),
            nextBtn = player.querySelector(".nextBtn"),
            progressBar = player.querySelector(".progressBar"),
            progress = player.querySelector(".progress"),
            volumeBar = player.querySelector(".volumeBar"),
            volumeLevel = volumeBar?.querySelector(".volume"),
            vol1Icon = player.querySelector(".vol1"),
            vol0Icon = player.querySelector(".vol0"),
            speedContainer = player.querySelector(".speed-container"),
            speedBtn = player.querySelector(".speedBtn"),
            timeDisplay = player.querySelector(".timeDisplay"),
            currentTime = player.querySelector(".currentTime"),
            totalTime = player.querySelector(".totalTime");

        let showRemainingTime = false;
        let previousVolume = 0.5; // Сохраняем предыдущий уровень громкости

        // Устанавливаем ширину полосы громкости на 50% изначально
        volumeLevel.style.width = "50%";

        function playSong() {
            player.classList.add("playing");
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
            audio.play();
        }

        function pauseSong() {
            player.classList.remove("playing");
            playIcon.style.display = "block";
            pauseIcon.style.display = "none";
            audio.pause();
        }

        function updateTimeDisplay() {
            const duration = audio.duration || 0;
            const current = audio.currentTime || 0;
            if (showRemainingTime) {currentTime.textContent = `-${formatTime(duration - current)}`;} else {currentTime.textContent = formatTime(current);}
            totalTime.textContent = formatTime(duration);

            // Обновление прогресс-бара
            const progressPercent = (current / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        }

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }

        playPauseBtn.addEventListener("click", () => {if (player.classList.contains("playing")) {pauseSong();} else {playSong();}});

        prevBtn.addEventListener("click", () => {audio.currentTime = Math.max(0, audio.currentTime - jumpTime);});

        nextBtn.addEventListener("click", () => {audio.currentTime = Math.min(audio.duration, audio.currentTime + jumpTime);});

        progressBar.addEventListener("click", (e) => {
            const barWidth = progressBar.offsetWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            const newTime = (clickX / barWidth) * duration;
            audio.currentTime = newTime;
        });

        volumeBar.addEventListener("click", (e) => {
            const barWidth = volumeBar.offsetWidth;
            const clickX = e.offsetX;
            const volumePercent = Math.min(Math.max((clickX / barWidth), 0), 1);

            audio.volume = volumePercent;
            volumeLevel.style.width = `${volumePercent * 100}%`;

            if (volumePercent === 0) {vol1Icon.style.display = "none";vol0Icon.style.display = "block";} else {vol1Icon.style.display = "block";vol0Icon.style.display = "none";}
        });

        // Переключение режима отображения времени по клику на timeDisplay
        timeDisplay.addEventListener("click", () => {
            showRemainingTime = !showRemainingTime;
            updateTimeDisplay();
        });

        // Переключение скорости воспроизведения по клику на speed-container
        speedContainer.addEventListener("click", () => {
            const currentSpeed = parseFloat(speedBtn.textContent);
            const newSpeed = currentSpeed >= 2 ? 1 : currentSpeed + 0.25;
            speedBtn.textContent = newSpeed.toFixed(2);
            audio.playbackRate = newSpeed;
        });

        // Отключение/включение звука по клику
        vol1Icon.addEventListener("click", () => {
            previousVolume = audio.volume; // Сохраняем текущий уровень громкости
            audio.muted = true;
            audio.volume = 0;
            volumeLevel.style.width = "0%";
            vol1Icon.style.display = "none";
            vol0Icon.style.display = "block";
        });

        vol0Icon.addEventListener("click", () => {
            audio.muted = false;
            audio.volume = previousVolume; // Восстанавливаем предыдущий уровень громкости
            volumeLevel.style.width = `${previousVolume * 100}%`;
            vol1Icon.style.display = "block";
            vol0Icon.style.display = "none";
        });

        audio.addEventListener("timeupdate", updateTimeDisplay);
    });
});