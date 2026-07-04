import { prepareBackgroundVideo } from "./backgroundVideo.js";
import { initLandingOverlay } from "./landing.js";
import { initSideLabel } from "./sideLabel.js";
import { MusicPlayer } from "./musicPlayer.js";
window.addEventListener("DOMContentLoaded", () => {
    // List of VideoA and VideoB reference
    const bgVideoRefs = prepareBackgroundVideo();
    initLandingOverlay(bgVideoRefs);
    initSideLabel();
    const musicPlayer = MusicPlayer.create();
    musicPlayer === null || musicPlayer === void 0 ? void 0 : musicPlayer.init();
});
//# sourceMappingURL=main.js.map