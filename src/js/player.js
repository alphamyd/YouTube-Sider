const electron = require("electron");
const { ipcRenderer: ipc } = electron;

const cssSelectorsForRemove = ".ytp-player-content, .ytp-fullerscreen-edu-button, .html5-endscreen, .ytp-youtube-button, .ytp-subtitles-button, .ytp-fullscreen-button, .ytp-size-button, .ytp-pip-button, .ytp-miniplayer-button, .ytp-multicam-button, .ytp-next-button, .ytp-pause-overlay, .ytp-related-on-error-overlay, .annotation, .ytp-chrome-top, .ytp-contextmenu, .ytp-ce-element, .ytp-share-panel, .ytp-multicam-menu";

let isVideoRepeatEnabled = false;

// Receiving command for repeating video
ipc.on("player:command:repeat", (event, flag) => isVideoRepeatEnabled = flag);

window.addEventListener("load", () => {
  const videoElement = document.getElementsByTagName("video")[0];
  const playButton = document.getElementsByClassName("ytp-play-button")[0];

  let isVideoEnded = false;

  // Clear YouTube player from some annoying elements
  document.querySelectorAll(cssSelectorsForRemove).forEach((element) => element.remove());

  // Add custom css
  let styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.innerHTML = cssSelectorsForRemove + " { display: none !important; visibility: hidden !important; opacity: 0 !important; } ";

  document.getElementsByTagName("head")[0].appendChild(styleElement);

  // Receiving command that Media Play/Pause button pressed
  ipc.on("player:command:mediaplaypause", () => videoElement.paused ? videoElement.play() : videoElement.pause());

  // Video completion interval
  setInterval(() => {
    isVideoEnded = document.getElementsByClassName("ended-mode").length > 0;

    if (isVideoEnded && isVideoRepeatEnabled) {
      playButton.click();
    }
  }, 1000);

  // Remove context menu
  document.addEventListener("contextmenu", (event) => {
    const contextDOMElement = document.getElementsByClassName("ytp-contextmenu")[0];
    contextDOMElement && contextDOMElement.remove();

    event.preventDefault();
    return false;

  });
});