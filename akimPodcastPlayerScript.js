document.addEventListener("DOMContentLoaded", () => {
    const playerContainers = document.querySelectorAll(".akim-player-container");

    function createAudioPlayerHTML() {
        return `
            <div class="controls-container myFlex">
                <div class="playPauseBtn akimBtn circle akimHover">
                    <svg class="playBtn cBtn" viewBox="-5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 30L10 55V5L50 30Z"/>
                    </svg>
                    <svg class="pausBtn cBtn" style="display:none" viewBox="-5 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 5H25V55H10V5Z"/>
                        <path d="M35 5H50V55H35V5Z"/>
                    </svg>
                </div>
                <div class="prevBtn akimBtn circle">
                    <svg class="cBtn" viewBox="5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 30L30 55V43L19.5 30L30 17V5L10 30Z"/>
                        <path d="M30 30L50 55V43L39.5 30L50 17V5L30 30Z"/>
                    </svg>
                </div>
                <div class="nextBtn akimBtn circle">
                    <svg class="cBtn" viewBox="-5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 30L30 55V43L40.5 30L30 17V5L50 30Z"/>
                        <path d="M30 30L10 55V43L20.5 30L10 17V5L30 30Z"/>
                    </svg>
                </div>
            </div>
            <div class="progress-container myFlex">
                <div class="progressBar akimBtn">
                    <div class="progress" style="width: 0%;"></div>
                </div>
                <div class="timeDisplay myFlex akimBtn">
                    <span class="currentTime">00:00</span>/<span class="totalTime">00:00</span>
                </div>
            </div>
            <div class="speed-container myFlex akimBtn">
                <span class="speedBtn">1.00</span>
            </div>
            <div class="volume-container myFlex">
                <div class="volumeBtn akimBtn circle">
                    <svg class="vol1 cBtn" viewBox="5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.7778 19.2857H10V40.7143H27.7778L50 55V5L27.7778 19.2857Z"/>
                    </svg>
                    <svg class="vol0 cBtn" style="display:none" viewBox="5 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="vol0ff" d="M27.7778 19.2857H10V40.7143H27.7778L50 55V5L27.7778 19.2857Z"/>
                        <path class="volOff" d="M15 5L50 55" stroke-width="5"/>
                        <path class="volOff" d="M50 5L15 55" stroke-width="5"/>
                    </svg>
                </div>
                <div class="volumeBar akimBtn">
                    <div class="volume" style="width: 50%;"></div>
                </div>
            </div>
        `;
    }

    playerContainers.forEach((player, index) => {
        const audioSrc = player.getAttribute("audio");
        if (!audioSrc) {
            console.error(`Аудиофайл не указан для контейнера с индексом ${index}`);
            return;
        }

        const jumpTime = parseInt(player.getAttribute("jump")) || 10;

        const audio = document.createElement("audio");
        audio.src = audioSrc;
        audio.className = "tracks";
        player.appendChild(audio);

        const audioPlayer = document.createElement("div");
        audioPlayer.className = `akim flexPlayer audioPlayer${index + 1} myFlex`;
        audioPlayer.innerHTML = createAudioPlayerHTML();
        player.appendChild(audioPlayer);

        const playPauseBtn = player.querySelector(".playPauseBtn"),
            playIcon = playPauseBtn?.querySelector(".playBtn"),
            pauseIcon = playPauseBtn?.querySelector(".pausBtn"),
            progressBar = player.querySelector(".progressBar"),
            progress = player.querySelector(".progress"),
            volumeBar = player.querySelector(".volumeBar"),
            volumeLevel = volumeBar?.querySelector(".volume"),
            vol1Icon = player.querySelector(".vol1"),
            vol0Icon = player.querySelector(".vol0"),
            speedBtn = player.querySelector(".speedBtn"),
            currentTime = player.querySelector(".currentTime"),
            totalTime = player.querySelector(".totalTime");

        let showRemainingTime = false;

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
            if (showRemainingTime) {
                currentTime.textContent = `-${formatTime(duration - current)}`;
            } else {
                currentTime.textContent = formatTime(current);
            }
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

        playPauseBtn.addEventListener("click", () => {
            if (player.classList.contains("playing")) {
                pauseSong();
            } else {
                playSong();
            }
        });

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

            if (volumePercent === 0) {
                vol1Icon.style.display = "none";
                vol0Icon.style.display = "block";
            } else {
                vol1Icon.style.display = "block";
                vol0Icon.style.display = "none";
            }
        });

        audio.addEventListener("timeupdate", updateTimeDisplay);

        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case " ":
                    e.preventDefault();
                    if (player.classList.contains("playing")) {
                        pauseSong();
                    } else {
                        playSong();
                    }
                    break;
                case "ArrowLeft":
                    audio.currentTime = Math.max(0, audio.currentTime - jumpTime);
                    break;
                case "ArrowRight":
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + jumpTime);
                    break;
                case "+":
                    audio.volume = Math.min(1, audio.volume + 0.1);
                    volumeLevel.style.width = `${audio.volume * 100}%`;
                    break;
                case "-":
                    audio.volume = Math.max(0, audio.volume - 0.1);
                    volumeLevel.style.width = `${audio.volume * 100}%`;
                    break;
                case "/":
                    showRemainingTime = !showRemainingTime;
                    updateTimeDisplay();
                    break;
                case "*":
                    const currentSpeed = parseFloat(speedBtn.textContent);
                    const newSpeed = currentSpeed >= 2 ? 0.5 : currentSpeed + 0.5;
                    speedBtn.textContent = newSpeed.toFixed(2);
                    audio.playbackRate = newSpeed;
                    break;
            }
        });
    });
});