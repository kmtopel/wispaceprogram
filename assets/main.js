const recordPlayer = document.querySelector('.js-record-player');


const audioPlayer = document.querySelector('.js-audio-player');
const customAudioPlayer = document.querySelector('.js-custom-audio-player');
const playPauseBtn = customAudioPlayer.querySelector('.js-play-pause');
const playIcon = playPauseBtn.querySelector('.js-play-icon');
const pauseIcon = playPauseBtn.querySelector('.js-pause-icon');
const progressBar = customAudioPlayer.querySelector('.js-progress-bar');
const progressBarContainer = customAudioPlayer.querySelector('.js-progress-bar-container');
const progressCursor = customAudioPlayer.querySelector('.js-progress-cursor');
const currentTime = customAudioPlayer.querySelector('.js-current-time');
const totalTime = customAudioPlayer.querySelector('.js-total-time');

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        customAudioPlayer.classList.add('is-playing');
        playIcon.classList.add('visually-hidden');
        pauseIcon.classList.remove('visually-hidden');
    } else {
        audioPlayer.pause();
        customAudioPlayer.classList.remove('is-playing');
        playIcon.classList.remove('visually-hidden');
        pauseIcon.classList.add('visually-hidden');
    }
});

const updateProgressBar = () => {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${percentage}%`;
    progressCursor.style.left = `${percentage}%`;
};

const updateTime = () => {
    const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
    const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
    const totalMinutes = Math.floor(audioPlayer.duration / 60);
    const totalSeconds = Math.floor(audioPlayer.duration % 60);
    currentTime.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
    totalTime.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}`;
}

const getTotalTime = () => {
    const totalMinutes = Math.floor(audioPlayer.duration / 60);
    const totalSeconds = Math.floor(audioPlayer.duration % 60);
    return `${totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}`;
}

const setTotalTime = () => {
    const totalTime = getTotalTime();
    totalTime.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}`;
};

const slideCursor = (e) => {
    const bar = progressBar.getBoundingClientRect();
    const x = e.clientX - bar.left;
    const percentage = (x / bar.width) * 100;
    progressBar.style.width = `${percentage}%`;
    progressCursor.style.left = `${percentage}%`;
    audioPlayer.currentTime = (audioPlayer.duration / 100) * percentage;
};

progressCursor.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', slideCursor);
});

document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', slideCursor);
});

audioPlayer.addEventListener('timeupdate', updateProgressBar);
audioPlayer.addEventListener('timeupdate', updateTime);

progressBarContainer.addEventListener('click', (e) => {
    slideCursor(e);
    updateTime();
});

setTotalTime();

