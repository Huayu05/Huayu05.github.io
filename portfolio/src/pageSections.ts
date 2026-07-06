interface PageSectionConfig {
  /** Must match the element's id, and the hash used in nav links (e.g. "#persona" -> "persona") */
  id: string;
  videoSrc: string;
}

// Add more entries here as you build out other full-page sections
const PAGE_SECTIONS: PageSectionConfig[] = [
  { id: "persona", videoSrc: "assets/videos/Persona.mp4" },
  { id: "skill", videoSrc: "assets/videos/Skill.mp4" },
];

/** Shows the page section matching the current hash, hides/pauses all others. */
function showSection(activeId: string): void {
  PAGE_SECTIONS.forEach((config) => {
    const section = document.getElementById(config.id);
    const video = section?.querySelector<HTMLVideoElement>("video");
    const content = section?.querySelector<HTMLElement>(".page-content");
    if (!section || !video) return;

    if (config.id === activeId) {
      // Lazy-load: only assign src (and the "ended" listener) the first time this section is opened
      if (!video.src) {
        video.src = config.videoSrc;
        video.addEventListener("ended", () => {
          content?.classList.add("visible");
        });
      }
      section.classList.add("active");
      content?.classList.remove("visible"); // hide again until this playthrough ends
      video.currentTime = 0; // always replay from the start on reopen
      video.play();
    } else {
      section.classList.remove("active");
      content?.classList.remove("visible");
      video.pause();
    }
  });
}

function handleHashChange(): void {
  const activeId = window.location.hash.replace("#", "");
  showSection(activeId);
}

/** Wires up hash-based navigation for full-page video sections. */
export function initPageSections(): void {
  window.addEventListener("hashchange", handleHashChange);
  handleHashChange(); // handles landing directly on a URL that already has a hash
}
