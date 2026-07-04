// Data type definition for tracks
interface Track {
  title: string;
  file: string;
}

// Hard coded music list
const TRACKS: Track[] = [
  { title: "Full Moon Full Life", file: "assets/musics/1-01-Full-Moon-Full-Life.mp3" },
  { title: "When The Moon's Reaching Out Stars", file: "assets/musics/1-10-When-The-Moon's-Reaching-Out-Stars.mp3" },
  { title: "Mass Destruction", file: "assets/musics/1-14-Mass-Destruction.mp3" },
];

export class MusicPlayer {
  // Elements initialization
  private audio: HTMLAudioElement;
  private playBtn: HTMLElement;
  private prevBtn: HTMLElement;
  private nextBtn: HTMLElement;
  private trackTitle: HTMLElement;
  private currentIndex = 0;

  /** 
   * Returns a MusicPlayer instance.
   * Null if any required element is missing from the page. 
   */
  static create(): MusicPlayer | null {
    const audio = document.getElementById("audio-el") as HTMLAudioElement | null;
    const playBtn = document.getElementById("play-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const trackTitle = document.getElementById("track-title");

    if (!audio || !playBtn || !prevBtn || !nextBtn || !trackTitle) return null;
    return new MusicPlayer(audio, playBtn, prevBtn, nextBtn, trackTitle);
  }

  private constructor(
    audio: HTMLAudioElement,
    playBtn: HTMLElement,
    prevBtn: HTMLElement,
    nextBtn: HTMLElement,
    trackTitle: HTMLElement
  ) {
    this.audio = audio;
    this.playBtn = playBtn;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.trackTitle = trackTitle;
  }

  /** 
   * Initialize function.
   * Configuration of the music player
   */
  init(): void {
    // Hard coded volumn (0.0-1.0)
    this.audio.volume = 0.3;

    // Play button click event binding
    this.playBtn.addEventListener("click", () => {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
      this.updatePlayButton();
    });

    // Previous button click event binding
    this.prevBtn.addEventListener("click", () => {
      const newIndex = (this.currentIndex - 1 + TRACKS.length) % TRACKS.length;
      this.loadTrack(newIndex, true);
    });

    // Next button click event binding
    this.nextBtn.addEventListener("click", () => {
      const newIndex = (this.currentIndex + 1) % TRACKS.length;
      this.loadTrack(newIndex, true);
    });

    // Audio ending listener
    this.audio.addEventListener("ended", () => {
      const newIndex = (this.currentIndex + 1) % TRACKS.length;
      this.loadTrack(newIndex, true);
    });

    // Initialize the index randomly
    const randomIndex = Math.floor(Math.random() * TRACKS.length);
    this.loadTrack(randomIndex, false);

    // Try autoplay immediately; fall back to starting on first user interaction if blocked
    this.audio
      .play()
      .then(() => {
        this.updatePlayButton();
      })
      .catch(() => {
        this.updatePlayButton();
        const startOnInteraction = () => {
          this.audio.play();
          this.updatePlayButton();
          document.removeEventListener("click", startOnInteraction);
        };
        document.addEventListener("click", startOnInteraction, { once: true });
      });
  }

  // Function to load up the track
  private loadTrack(index: number, autoplay: boolean): void {
    this.currentIndex = index;
    const track = TRACKS[this.currentIndex];
    this.audio.src = track.file;
    this.trackTitle.textContent = track.title;
    this.updateMarquee();
    if (autoplay) {
      this.audio.play();
      this.updatePlayButton();
    }
  }

  // Song name rolling if too long
  private updateMarquee(): void {
    const container = this.trackTitle.parentElement;
    if (!container) return;

    // Only scroll if the text is actually wider than its box
    const isOverflowing = this.trackTitle.scrollWidth > container.clientWidth;
    container.classList.toggle("scrolling", isOverflowing);
  }

  // Button changing
  private updatePlayButton(): void {
    this.playBtn.textContent = this.audio.paused ? "▶" : "⏸";
  }
}
