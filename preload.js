const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  function checkTitle() {
    return document.title === "YouTube Music";
  }

  function checkLike() {
    const likeButton = document.querySelector('.middle-controls-buttons .like');
    return likeButton && likeButton.getAttribute("aria-pressed") == "true";
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

    ipcRenderer.send("update-thumbar-buttons", {
      isTrackSelected: !isYouTubeMusic,
    });
    ipcRenderer.send("update-play-pause", !isYouTubeMusic); // Изменяем состояние play/pause
  });

  observer.observe(document.querySelector("title"), {
    childList: true,
    subtree: true,
  });

  const likeButton = document.querySelector('.middle-controls-buttons .like');

  const observer2 = new MutationObserver(() => {
    const isLiked = checkLike();
    ipcRenderer.send("update-like-button", !isLiked);
  });

  observer2.observe(likeButton, {
    attributes: true,
    attributeFilter: ["aria-pressed"],
  });

  ipcRenderer.on("like-track", () => {
    const likeButtonElement = document.querySelector('.middle-controls-buttons .like button');
    if (likeButtonElement) {
      const isLiked = checkLike();
      likeButtonElement.click();
      ipcRenderer.send("update-like-button", isLiked);
    }
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
