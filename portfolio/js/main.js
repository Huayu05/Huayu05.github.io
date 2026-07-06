import { prepareBackgroundVideo } from "./backgroundVideo.js";
import { initLandingOverlay } from "./landing.js";
import { initSideLabel } from "./sideLabel.js";
import { MusicPlayer } from "./musicPlayer.js";
import { initPageSections } from "./pageSections.js";
import { initSkillList } from "./skillList.js";
window.addEventListener("DOMContentLoaded", () => {
    const bgVideoRefs = prepareBackgroundVideo(); // starts loading immediately, doesn't play yet
    initLandingOverlay(bgVideoRefs);
    initSideLabel();
    initPageSections();
    initSkillList();
    const musicPlayer = MusicPlayer.create();
    musicPlayer === null || musicPlayer === void 0 ? void 0 : musicPlayer.init();
});
//# sourceMappingURL=main.js.map