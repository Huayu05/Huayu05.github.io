// Add more entries here as you build out other full-page sections
const PAGE_SECTIONS = [
    { id: "persona", videoSrc: "assets/videos/Persona.mp4" },
];
/** Shows the page section matching the current hash, hides/pauses all others. */
function showSection(activeId) {
    PAGE_SECTIONS.forEach((config) => {
        const section = document.getElementById(config.id);
        const video = section === null || section === void 0 ? void 0 : section.querySelector("video");
        const content = section === null || section === void 0 ? void 0 : section.querySelector(".page-content");
        if (!section || !video)
            return;
        if (config.id === activeId) {
            // Lazy-load: only assign src (and the "ended" listener) the first time this section is opened
            if (!video.src) {
                video.src = config.videoSrc;
                video.addEventListener("ended", () => {
                    content === null || content === void 0 ? void 0 : content.classList.add("visible");
                });
            }
            section.classList.add("active");
            content === null || content === void 0 ? void 0 : content.classList.remove("visible"); // hide again until this playthrough ends
            video.currentTime = 0; // always replay from the start on reopen
            video.play();
        }
        else {
            section.classList.remove("active");
            content === null || content === void 0 ? void 0 : content.classList.remove("visible");
            video.pause();
        }
    });
}
function handleHashChange() {
    const activeId = window.location.hash.replace("#", "");
    showSection(activeId);
}
/** Wires up hash-based navigation for full-page video sections. */
export function initPageSections() {
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // handles landing directly on a URL that already has a hash
}
//# sourceMappingURL=pageSections.js.map