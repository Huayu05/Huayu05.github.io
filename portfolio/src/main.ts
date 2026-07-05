import { prepareBackgroundVideo } from "./backgroundVideo.js";
import { initLandingOverlay } from "./landing.js";
import { initSideLabel } from "./sideLabel.js";
import { MusicPlayer } from "./musicPlayer.js";
import { initPageSections } from "./pageSections.js";

window.addEventListener("DOMContentLoaded", () => {
  const bgVideoRefs = prepareBackgroundVideo(); // starts loading immediately, doesn't play yet
  initLandingOverlay(bgVideoRefs);

  initSideLabel();
  initPageSections();

  const musicPlayer = MusicPlayer.create();
  musicPlayer?.init();
});
