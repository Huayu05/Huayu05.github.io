/**
 * Sets up the two background videos and starts preloading them.
 * Does NOT start playback — call startBackgroundVideo() for that.
 */
export function prepareBackgroundVideo() {
    // Element checking
    const videoA = document.getElementById("video-a");
    const videoB = document.getElementById("video-b");
    if (!videoA || !videoB)
        return null;
    // Element assets loader
    const firstVideo = "assets/videos/P3R_Menu1.mp4";
    const loopVideo = "assets/videos/P3R_Menu2.mp4";
    // Element configuration
    videoA.preload = "auto";
    videoB.preload = "auto";
    videoA.src = firstVideo;
    videoB.src = loopVideo;
    videoB.loop = true;
    // Loop starting after VideoA ended
    videoA.addEventListener("ended", () => {
        videoB.currentTime = 0;
        videoB.play();
        videoB.classList.add("active");
        videoA.classList.remove("active");
    });
    return { videoA, videoB };
}
/**
 * Starts playback of the already-prepared background video.
 * To avoid the loading makes screen blank too long.
 * */
export function startBackgroundVideo(refs) {
    if (!refs)
        return;
    refs.videoA.play();
}
//# sourceMappingURL=backgroundVideo.js.map