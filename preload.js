const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  let isPlaying = false;

  function checkTitle() {
    return document.title === "YouTube Music";
  }

  function checkTrackSelection() {
    const playPauseButton = document.querySelector(".play-pause-button");
    const isTrackSelected = !!playPauseButton;
    ipcRenderer.send("update-thumbar-buttons", { isTrackSelected });
    return isTrackSelected;
  }

  function togglePlayPause() {
    const progressBar = document.querySelector("#progress-bar");
    if (progressBar) {
      const progressValue = progressBar.getAttribute("aria-valuetext");
      if (progressValue.includes("NaN")) {
        const myDiv = document.querySelector(".ytmusic-play-button-renderer");
        myDiv.click();
      } else {
        const playPauseButton = document.querySelector(".play-pause-button");
        if (playPauseButton) {
          playPauseButton.click();
        }
      }
    }
  }

  const observer = new MutationObserver(() => {
    const isYouTubeMusic = checkTitle();
    console.log(isYouTubeMusic);

    ipcRenderer.send("update-thumbar-buttons", {
      isTrackSelected: !isYouTubeMusic,
    });
    ipcRenderer.send("update-play-pause", !isYouTubeMusic); // Изменяем состояние play/pause
  });

  observer.observe(document.querySelector("title"), {
    childList: true,
    subtree: true,
  });

  ipcRenderer.on("media-play-pause", togglePlayPause);
  ipcRenderer.on("media-next-track", () => {
    const nextButton = document.querySelector(".next-button");
    if (nextButton && !nextButton.disabled) {
      nextButton.click();
    }
  });

  ipcRenderer.on("media-previous-track", () => {
    const previousButton = document.querySelector(".previous-button");
    if (previousButton && !previousButton.disabled) {
      previousButton.click();
    }
  });
});
