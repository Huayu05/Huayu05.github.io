window.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("intro-video") as HTMLVideoElement | null;
  if (!video) return;

  const firstVideo = "assets/videos/P3R_Menu1.mp4";
  const loopVideo = "assets/videos/P3R_Menu2.mp4";

  video.src = firstVideo;
  video.loop = false;
  video.play();

  video.addEventListener("ended", () => {
    video.src = loopVideo;
    video.loop = true;
    video.play();
  });
});