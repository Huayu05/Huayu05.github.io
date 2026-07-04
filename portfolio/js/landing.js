import { startBackgroundVideo } from "./backgroundVideo.js";
/**
 * Initiate landing video which simpily an overlay video.
 * Fade out and start the background video after click.
 */
export function initLandingOverlay(bgVideoRefs) {
    // Element checking
    const overlay = document.getElementById("landing-overlay");
    const video = document.getElementById("landing-video");
    const siteContent = document.getElementById("site-content");
    if (!overlay || !video || !siteContent)
        return;
    // Element assets loader
    video.src = "assets/videos/Landing.mp4";
    // Click listener
    overlay.addEventListener("click", () => {
        overlay.classList.add("fade-out");
        // Matches the CSS opacity transition duration on #landing-overlay
        setTimeout(() => {
            video.pause();
            startBackgroundVideo(bgVideoRefs);
        }, 600);
        // Delay before revealing the main site content
        setTimeout(() => {
            siteContent.classList.add("visible");
        }, 2000);
    }, { once: true });
}
//# sourceMappingURL=landing.js.map