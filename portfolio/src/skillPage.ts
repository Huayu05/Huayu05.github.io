const ROW_HEIGHT = 56; // must match .skill-item's height in CSS
const STEP_COOLDOWN_MS = 100; // slightly longer than the CSS transition, prevents double-steps
const MIN_VISIBLE_ROWS = 3; // never show fewer than this, even on very short screens
const MAX_VISIBLE_ROWS = 8; // never show more than this, even on tall screens
const VIEWPORT_HEIGHT_RATIO = 0.6; // use up to 60% of window height for the list

export function initSkillList(): void {
  const viewport = document.querySelector<HTMLElement>(".skill-viewport");
  const list = document.getElementById("skill-list");
  if (!viewport || !list) return;

  const items = Array.from(list.querySelectorAll<HTMLElement>(".skill-item"));
  const maxIndex = Math.max(0, items.length - 1);

  let currentIndex = 0;
  let isAnimating = false;
  let visibleRows = MAX_VISIBLE_ROWS;

  function calculateVisibleRows(): void {
    const availableHeight = window.innerHeight * VIEWPORT_HEIGHT_RATIO;
    const fittingRows = Math.floor(availableHeight / ROW_HEIGHT);

    visibleRows = Math.min(MAX_VISIBLE_ROWS, Math.max(MIN_VISIBLE_ROWS, fittingRows));
    viewport!.style.height = `${visibleRows * ROW_HEIGHT}px`;
  }

  function updatePosition(): void {
    list!.style.transform = `translateY(-${currentIndex * ROW_HEIGHT}px)`;

    items.forEach((item, i) => {
      item.classList.toggle("faded", i < currentIndex);
    });
  }

  function step(direction: 1 | -1): void {
    if (isAnimating) return;

    const nextIndex = currentIndex + direction;
    const maxScrollIndex = Math.max(0, maxIndex - visibleRows + 1);
    if (nextIndex < 0 || nextIndex > maxScrollIndex) return;

    currentIndex = nextIndex;
    isAnimating = true;
    updatePosition();

    setTimeout(() => {
      isAnimating = false;
    }, STEP_COOLDOWN_MS);
  }

  calculateVisibleRows();

  let resizeTimeout: number | undefined;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      calculateVisibleRows();
      // Clamp currentIndex in case fewer rows now fit than the current scroll position allows
      const maxScrollIndex = Math.max(0, maxIndex - visibleRows + 1);
      if (currentIndex > maxScrollIndex) {
        currentIndex = maxScrollIndex;
        updatePosition();
      }
    }, 150);
  });

  viewport.addEventListener(
    "wheel",
    (event: WheelEvent) => {
      event.preventDefault();
      step(event.deltaY > 0 ? 1 : -1);
    },
    { passive: false }
  );

  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      step(-1);
    }
  });
}