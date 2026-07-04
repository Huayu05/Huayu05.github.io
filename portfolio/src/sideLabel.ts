/** Resizes the vertical #side-label text so it spans ~80% of the viewport height. */
function fitVerticalLabel(): void {
  const el = document.getElementById("side-label");
  if (!el) return;

  const targetHeight = window.innerHeight * 0.8;

  el.style.fontSize = "1px";
  const naturalHeightAt1px = el.scrollHeight;

  const fittedFontSize = targetHeight / naturalHeightAt1px;
  el.style.fontSize = `${fittedFontSize}px`;
}

/** Sets up the side label sizing and keeps it correct across fonts loading, resize, and rotation. */
export function initSideLabel(): void {
  // Wait for fonts to actually finish loading before the first measurement
  document.fonts.ready.then(() => {
    fitVerticalLabel();
  });

  // Debounce resize so rapid mobile resize events don't cause jittery/wrong recalculations
  let resizeTimeout: number | undefined;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(fitVerticalLabel, 150);
  });

  // Also handle phone rotation explicitly
  window.addEventListener("orientationchange", () => {
    window.setTimeout(fitVerticalLabel, 150);
  });
}
