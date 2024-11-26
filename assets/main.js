const audioPlayer = document.querySelector('.js-audio-player');
const customAudioPlayer = document.querySelector('.js-custom-audio-player');
const playPauseBtn = customAudioPlayer.querySelector('.js-play-pause');
const playIcon = playPauseBtn.querySelector('.js-play-icon');
const pauseIcon = playPauseBtn.querySelector('.js-pause-icon');
const progressBar = customAudioPlayer.querySelector('.js-progress-bar');
const progressBarContainer = customAudioPlayer.querySelector('.js-progress-bar-container');
const progressCursor = customAudioPlayer.querySelector('.js-progress-cursor');
const currentTimeElement = customAudioPlayer.querySelector('.js-current-time');
const totalTimeElement = customAudioPlayer.querySelector('.js-total-time');

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
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    totalTimeElement.textContent = formatTime(audioPlayer.duration || 0);
};

const slideCursor = (e) => {
    const barRect = progressBarContainer.getBoundingClientRect();
    const percentage = ((e.clientX - barRect.left) / barRect.width) * 100;
    progressBar.style.width = `${percentage}%`;
    progressCursor.style.left = `${percentage}%`;
    audioPlayer.currentTime = (audioPlayer.duration / 100) * percentage;
};

progressBarContainer.addEventListener('click', (e) => {
    slideCursor(e);
    updateTime();
});

let isDragging = false;
progressCursor.addEventListener('mousedown', () => {
    isDragging = true;
    document.addEventListener('mousemove', slideCursor);
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        document.removeEventListener('mousemove', slideCursor);
        isDragging = false;
    }
});

audioPlayer.addEventListener('loadeddata', updateTime);
audioPlayer.addEventListener('timeupdate', () => {
    updateProgressBar();
    updateTime();
});

audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeElement.textContent = formatTime(audioPlayer.duration);
});

window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
window.LOCALE = 'en';
window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";

window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";

window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";




window.translation = {
common: {
    selectedList: '{quantity} list selected',
    selectedLists: '{quantity} lists selected'
}
};

var AUTOHIDE = Boolean(1);