"use strict";
function prepareBackgroundVideo() {
    const videoA = document.getElementById("video-a");
    const videoB = document.getElementById("video-b");
    if (!videoA || !videoB)
        return null;
    const firstVideo = "assets/videos/P3R_Menu1.mp4";
    const loopVideo = "assets/videos/P3R_Menu2.mp4";
    videoA.preload = "auto";
    videoB.preload = "auto";
    videoA.src = firstVideo;
    videoB.src = loopVideo;
    videoB.loop = true;
    videoA.addEventListener("ended", () => {
        videoB.currentTime = 0;
        videoB.play();
        videoB.classList.add("active");
        videoA.classList.remove("active");
    });
    return { videoA, videoB };
}
function startBackgroundVideo(refs) {
    if (!refs)
        return;
    refs.videoA.play();
}
function initLandingOverlay(bgVideoRefs) {
    const overlay = document.getElementById("landing-overlay");
    const video = document.getElementById("landing-video");
    const siteContent = document.getElementById("site-content");
    if (!overlay || !video || !siteContent)
        return;
    video.src = "assets/videos/landing.mp4";
    overlay.addEventListener("click", () => {
        overlay.classList.add("fade-out");
        setTimeout(() => {
            video.pause();
            startBackgroundVideo(bgVideoRefs);
        }, 600);
        setTimeout(() => {
            siteContent.classList.add("visible");
        }, 2000);
    }, { once: true });
}
window.addEventListener("DOMContentLoaded", () => {
    const bgVideoRefs = prepareBackgroundVideo(); // starts loading immediately, doesn't play yet
    initLandingOverlay(bgVideoRefs);
});
function fitVerticalLabel() {
    const el = document.getElementById("side-label");
    if (!el)
        return;
    const targetHeight = window.innerHeight * 0.8;
    el.style.fontSize = "1px";
    const naturalHeightAt1px = el.scrollHeight;
    const fittedFontSize = targetHeight / naturalHeightAt1px;
    el.style.fontSize = `${fittedFontSize}px`;
}
// Wait for fonts to actually finish loading before the first measurement
document.fonts.ready.then(() => {
    fitVerticalLabel();
});
// Debounce resize so rapid mobile resize events don't cause jittery/wrong recalculations
let resizeTimeout;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(fitVerticalLabel, 150);
});
// Also handle phone rotation explicitly
window.addEventListener("orientationchange", () => {
    window.setTimeout(fitVerticalLabel, 150);
});
// Edit this list with your actual files in assets/music/
const tracks = [
    { title: "Full Moon Full Life", file: "assets/musics/1-01-Full-Moon-Full-Life.mp3" },
    { title: "When The Moon's Reaching Out Stars", file: "assets/musics/1-10-When-The-Moon's-Reaching-Out-Stars.mp3" },
    { title: "Mass Destruction", file: "assets/musics/1-14-Mass-Destruction.mp3" },
];
function initMusicPlayer() {
    const audio = document.getElementById("audio-el");
    const playBtn = document.getElementById("play-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const trackTitle = document.getElementById("track-title");
    if (!audio || !playBtn || !prevBtn || !nextBtn || !trackTitle)
        return;
    audio.volume = 0.3;
    let currentIndex = 0;
    function loadTrack(index, autoplay) {
        if (!audio || !trackTitle)
            return;
        currentIndex = index;
        const track = tracks[currentIndex];
        audio.src = track.file;
        trackTitle.textContent = track.title;
        updateMarquee();
        if (autoplay) {
            audio.play();
            updatePlayButton();
        }
    }
    function updateMarquee() {
        if (!trackTitle)
            return;
        const container = trackTitle.parentElement;
        if (!container)
            return;
        // Only scroll if the text is actually wider than its box
        const isOverflowing = trackTitle.scrollWidth > container.clientWidth;
        container.classList.toggle("scrolling", isOverflowing);
    }
    function updatePlayButton() {
        if (!audio || !playBtn)
            return;
        playBtn.textContent = audio.paused ? "▶" : "⏸";
    }
    playBtn.addEventListener("click", () => {
        if (!audio)
            return;
        if (audio.paused) {
            audio.play();
        }
        else {
            audio.pause();
        }
        updatePlayButton();
    });
    prevBtn.addEventListener("click", () => {
        const newIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        loadTrack(newIndex, true);
    });
    nextBtn.addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % tracks.length;
        loadTrack(newIndex, true);
    });
    audio.addEventListener("ended", () => {
        const newIndex = (currentIndex + 1) % tracks.length;
        loadTrack(newIndex, true);
    });
    const randomIndex = Math.floor(Math.random() * tracks.length);
    loadTrack(randomIndex, false);
    // Try autoplay immediately
    audio.play()
        .then(() => {
        updatePlayButton();
    })
        .catch(() => {
        // Browser blocked autoplay — wait for the first user interaction, then play
        updatePlayButton();
        const startOnInteraction = () => {
            audio.play();
            updatePlayButton();
            document.removeEventListener("click", startOnInteraction);
        };
        document.addEventListener("click", startOnInteraction, { once: true });
    });
}
window.addEventListener("DOMContentLoaded", initMusicPlayer);
window.addEventListener("DOMContentLoaded", fitVerticalLabel);
window.addEventListener("resize", fitVerticalLabel);
//# sourceMappingURL=main.js.map