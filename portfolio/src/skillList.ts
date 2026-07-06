const ROW_HEIGHT = 56; // must match .skill-item's height in CSS
const STEP_COOLDOWN_MS = 450; // slightly longer than the CSS transition, prevents double-steps

export function initSkillList(): void {
  const viewport = document.querySelector<HTMLElement>(".skill-viewport");
  const list = document.getElementById("skill-list");
  if (!viewport || !list) return;

  const items = Array.from(list.querySelectorAll<HTMLElement>(".skill-item"));
  const maxIndex = Math.max(0, items.length - 1);

  let currentIndex = 0;
  let isAnimating = false;

  function updatePosition(): void {
    list!.style.transform = `translateY(-${currentIndex * ROW_HEIGHT}px)`;

    items.forEach((item, i) => {
      item.classList.toggle("faded", i < currentIndex);
    });
  }

  function step(direction: 1 | -1): void {
    if (isAnimating) return;

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex > maxIndex) return;

    currentIndex = nextIndex;
    isAnimating = true;
    updatePosition();

    setTimeout(() => {
      isAnimating = false;
    }, STEP_COOLDOWN_MS);
  }

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
