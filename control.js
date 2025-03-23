// Находим контейнер плеера
const player = document.querySelector(".akim-player-container");

// Получаем путь к треку из атрибута audio
const audioSrc = player.getAttribute("audio");

// Получаем значение перемотки из атрибута jump (по умолчанию 10 секунд)
const jumpTime = parseInt(player.getAttribute("jump")) || 10;

// Создаём элемент <audio> и добавляем его в контейнер
const audio = document.createElement("audio");
audio.src = audioSrc; // Устанавливаем путь к треку
audio.className = "tracks"; // Добавляем класс для аудио
player.appendChild(audio); // Вставляем элемент <audio> в контейнер

// Находим элементы управления
const playPauseBtn = player.querySelector(".playPauseBtn"),
    playIcon = playPauseBtn.querySelector(".playBtn"),
    pauseIcon = playPauseBtn.querySelector(".pausBtn"),
    prevBtn = player.querySelector(".prevBtn"),
    nextBtn = player.querySelector(".nextBtn"),
    progressBar = player.querySelector(".progressBar"),
    progress = player.querySelector(".progress"),
    currentTime = player.querySelector(".currentTime"),
    totalTime = player.querySelector(".totalTime"),
    timeDisplay = player.querySelector(".timeDisplay"), // Контейнер времени
    volumeBtn = player.querySelector(".volumeBtn"),
    vol1Icon = volumeBtn.querySelector(".vol1"),
    vol0Icon = volumeBtn.querySelector(".vol0"),
    volumeBar = player.querySelector(".volumeBar"),
    volumeLevel = volumeBar.querySelector(".volume"),
    speedContainer = player.querySelector(".speed-container"), // Контейнер скорости
    speedBtn = speedContainer.querySelector(".speedBtn"); // Кнопка скорости

// Флаг для переключения между прошедшим и оставшимся временем
let showRemainingTime = false;

// Возможные значения скорости воспроизведения
const playbackSpeeds = [1.0, 1.25, 1.5, 1.75, 2.0];
let currentSpeedIndex = 0; // Индекс текущей скорости

// Переменная для хранения предыдущего уровня громкости
let previousVolume = 0.5; // По умолчанию 50%

// Функция воспроизведения аудио
function playSong() {
    player.classList.add("playing"); // Добавляем класс для визуального состояния
    playIcon.style.display = "none"; // Прячем иконку Play
    pauseIcon.style.display = "block"; // Показываем иконку Pause
    audio.play(); // Запускаем воспроизведение
    startProgressUpdate(); // Запускаем обновление прогресс-бара
}

// Функция паузы
function pauseSong() {
    player.classList.remove("playing"); // Убираем класс состояния
    playIcon.style.display = "block"; // Показываем иконку Play
    pauseIcon.style.display = "none"; // Прячем иконку Pause
    audio.pause(); // Ставим трек на паузу
    stopProgressUpdate(); // Останавливаем обновление прогресс-бара
}

// Обработчик на кнопку play/pause
playPauseBtn.addEventListener("click", () => {
    if (player.classList.contains("playing")) {
        pauseSong(); // Если трек играет, ставим на паузу
    } else {
        playSong(); // Если трек не играет, запускаем воспроизведение
    }
});

// Обработчик события завершения трека
audio.addEventListener("ended", () => {
    pauseSong(); // Ставим трек на паузу и возвращаем иконку Play
    progress.style.width = "0%"; // Сбрасываем прогресс-бар
});

// Обработчик на кнопку перемотки назад
prevBtn.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - jumpTime); // Перематываем назад, но не меньше 0
});

// Обработчик на кнопку перемотки вперёд
nextBtn.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + jumpTime); // Перематываем вперёд, но не больше длительности трека
});

// Обработчик клика на прогресс-бар
progressBar.addEventListener("click", (e) => {
    const barWidth = progressBar.offsetWidth; // Ширина прогресс-бара
    const clickX = e.offsetX; // Позиция клика относительно прогресс-бара
    const duration = audio.duration; // Общая длительность трека

    // Вычисляем новое время воспроизведения
    const newTime = (clickX / barWidth) * duration;
    audio.currentTime = newTime; // Устанавливаем новое время
});

// Обработчик клика на кнопку скорости
speedContainer.addEventListener("click", () => {
    currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length; // Переходим к следующей скорости
    const newSpeed = playbackSpeeds[currentSpeedIndex]; // Получаем новое значение скорости
    audio.playbackRate = newSpeed; // Устанавливаем скорость воспроизведения
    speedBtn.textContent = newSpeed.toFixed(2); // Обновляем текст кнопки скорости
});

// Обработчик клика на кнопку громкости
volumeBtn.addEventListener("click", () => {
    if (audio.volume > 0) {
        previousVolume = audio.volume; // Сохраняем текущий уровень громкости
        audio.volume = 0; // Устанавливаем громкость на 0
        volumeLevel.style.width = "0%";
        vol1Icon.style.display = "none";
        vol0Icon.style.display = "block";
    } else {
        audio.volume = previousVolume; // Восстанавливаем предыдущий уровень громкости
        volumeLevel.style.width = `${previousVolume * 100}%`;
        vol1Icon.style.display = "block";
        vol0Icon.style.display = "none";
    }
});

// Обработчик клика на уровень громкости
volumeBar.addEventListener("click", (e) => {
    const barWidth = volumeBar.offsetWidth; // Ширина регулятора громкости
    const clickX = e.offsetX; // Позиция клика относительно регулятора
    const volumePercent = Math.min(Math.max((clickX / barWidth), 0), 1); // Ограничиваем диапазон 0-1

    // Устанавливаем громкость
    audio.volume = volumePercent;
    volumeLevel.style.width = `${volumePercent * 100}%`;

    // Обновляем иконки
    if (volumePercent === 0) {
        vol1Icon.style.display = "none";
        vol0Icon.style.display = "block";
    } else {
        vol1Icon.style.display = "block";
        vol0Icon.style.display = "none";
    }
});

// Обновление прогресс-бара
let progressInterval;

function startProgressUpdate() {
    progressInterval = setInterval(() => {
        const duration = audio.duration || 0; // Длительность трека
        const currentTimeValue = audio.currentTime || 0; // Текущее время воспроизведения
        const progressPercent = (currentTimeValue / duration) * 100; // Рассчитываем процент прогресса
        progress.style.width = `${progressPercent}%`; // Устанавливаем ширину прогресс-бара
        updateTimeDisplay(currentTimeValue, duration); // Обновляем отображение времени
    }, 50); // Интервал обновления 0.05 секунды
}

function stopProgressUpdate() {
    clearInterval(progressInterval); // Останавливаем интервал
}

// Обновление отображения времени
function updateTimeDisplay(current, total) {
    if (showRemainingTime) {
        currentTime.textContent = `-${formatTime(total - current)}`; // Отображаем оставшееся время
    } else {
        currentTime.textContent = formatTime(current); // Отображаем прошедшее время
    }
    totalTime.textContent = formatTime(total); // Общее время всегда отображается
}

// Форматирование времени в формате MM:SS
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Устанавливаем общую длительность трека при загрузке метаданных
audio.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatTime(audio.duration);
});

// Обработчик переключения отображения времени
timeDisplay.addEventListener("click", () => {
    showRemainingTime = !showRemainingTime; // Переключаем флаг
    updateTimeDisplay(audio.currentTime, audio.duration); // Обновляем отображение времени
});

// Управление с клавиатуры
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case " ": // Пробел: Play/Pause
            e.preventDefault(); // Предотвращаем прокрутку страницы
            if (player.classList.contains("playing")) {
                pauseSong();
            } else {
                playSong();
            }
            break;
        case "ArrowLeft": // Стрелка влево: Перемотка назад
            audio.currentTime = Math.max(0, audio.currentTime - jumpTime);
            break;
        case "ArrowRight": // Стрелка вправо: Перемотка вперёд
            audio.currentTime = Math.min(audio.duration, audio.currentTime + jumpTime);
            break;
        case "+": // Клавиша "+": Увеличение громкости
            audio.volume = Math.min(1, audio.volume + 0.1);
            volumeLevel.style.width = `${audio.volume * 100}%`;
            if (audio.volume > 0) {
                vol1Icon.style.display = "block";
                vol0Icon.style.display = "none";
            }
            break;
        case "-": // Клавиша "-": Уменьшение громкости
            audio.volume = Math.max(0, audio.volume - 0.1);
            volumeLevel.style.width = `${audio.volume * 100}%`;
            if (audio.volume === 0) {
                vol1Icon.style.display = "none";
                vol0Icon.style.display = "block";
            }
            break;
        case "*": // Клавиша "*": Увеличение скорости воспроизведения
            currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
            audio.playbackRate = playbackSpeeds[currentSpeedIndex];
            speedBtn.textContent = playbackSpeeds[currentSpeedIndex].toFixed(2);
            break;
        case "/": // Клавиша "/": Переключение режима отображения времени
            showRemainingTime = !showRemainingTime;
            updateTimeDisplay(audio.currentTime, audio.duration);
            break;
    }
});