window.addEventListener("DOMContentLoaded", () => {
  const videoA = document.getElementById("video-a") as HTMLVideoElement | null;
  const videoB = document.getElementById("video-b") as HTMLVideoElement | null;
  if (!videoA || !videoB) return;

  const firstVideo = "assets/videos/P3R_Menu1.mp4";
  const loopVideo = "assets/videos/P3R_Menu2.mp4";

  videoA.src = firstVideo;
  videoB.src = loopVideo;
  videoB.loop = true;

  videoA.play();

  videoA.addEventListener("ended", () => {
    videoB.currentTime = 0;
    videoB.play();

    videoB.classList.add("active");
    videoA.classList.remove("active");
  });
});