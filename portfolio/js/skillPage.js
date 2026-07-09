const ROW_HEIGHT = 56;
const MOBILE_ROW_HEIGHT = 38;
const MOBILE_BREAKPOINT = 768;
const STEP_COOLDOWN_MS = 100;
const MIN_VISIBLE_ROWS = 3;
const MAX_VISIBLE_ROWS = 8;
const MOBILE_MAX_VISIBLE_ROWS = 12;
const VIEWPORT_HEIGHT_RATIO = 0.6;
const SWIPE_THRESHOLD_PX = 24;
export function initSkillList() {
    const viewport = document.querySelector(".skill-viewport");
    const list = document.getElementById("skill-list");
    if (!viewport || !list)
        return;
    const items = Array.from(list.querySelectorAll(".skill-item"));
    const maxIndex = Math.max(0, items.length - 1);
    let currentIndex = 0;
    let isAnimating = false;
    let visibleRows = MAX_VISIBLE_ROWS;
    let rowHeight = ROW_HEIGHT;
    function getRowHeight() {
        return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_ROW_HEIGHT : ROW_HEIGHT;
    }
    function getMaxVisibleRows() {
        return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_MAX_VISIBLE_ROWS : MAX_VISIBLE_ROWS;
    }
    function calculateVisibleRows() {
        rowHeight = getRowHeight();
        const maxRows = getMaxVisibleRows();
        const availableHeight = window.innerHeight * VIEWPORT_HEIGHT_RATIO;
        const fittingRows = Math.floor(availableHeight / rowHeight);
        visibleRows = Math.min(maxRows, Math.max(MIN_VISIBLE_ROWS, fittingRows));
        viewport.style.height = `${visibleRows * rowHeight}px`;
    }
    function updatePosition() {
        list.style.transform = `translateY(-${currentIndex * rowHeight}px)`;
        items.forEach((item, i) => {
            item.classList.toggle("faded", i < currentIndex);
        });
    }
    function step(direction) {
        if (isAnimating)
            return;
        const nextIndex = currentIndex + direction;
        const maxScrollIndex = Math.max(0, maxIndex - visibleRows + 1);
        if (nextIndex < 0 || nextIndex > maxScrollIndex)
            return;
        currentIndex = nextIndex;
        isAnimating = true;
        updatePosition();
        setTimeout(() => {
            isAnimating = false;
        }, STEP_COOLDOWN_MS);
    }
    calculateVisibleRows();
    let resizeTimeout;
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
    viewport.addEventListener("wheel", (event) => {
        event.preventDefault();
        step(event.deltaY > 0 ? 1 : -1);
    }, { passive: false });
    // --- Touch / swipe support (phones don't fire wheel events) ---
    let touchStartY = null;
    let touchHandled = false;
    viewport.addEventListener("touchstart", (event) => {
        touchStartY = event.touches[0].clientY;
        touchHandled = false;
    }, { passive: true });
    viewport.addEventListener("touchmove", (event) => {
        if (touchStartY === null || touchHandled) {
            event.preventDefault();
            return;
        }
        const deltaY = touchStartY - event.touches[0].clientY;
        if (Math.abs(deltaY) >= SWIPE_THRESHOLD_PX) {
            touchHandled = true;
            step(deltaY > 0 ? 1 : -1);
        }
        event.preventDefault();
    }, { passive: false });
    viewport.addEventListener("touchend", () => {
        touchStartY = null;
        touchHandled = false;
    }, { passive: true });
    viewport.setAttribute("tabindex", "0");
    viewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            step(1);
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            step(-1);
        }
    });
}
//# sourceMappingURL=skillPage.js.map