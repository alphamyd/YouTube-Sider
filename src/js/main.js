import "../sass/main"; // Import styles

import path from "path";
const { ipcRenderer: ipc, remote } = electron;

import App from "./core/App";

const app = new App();

const isDevMode = process.env.NODE_ENV === "development";

const player = document.getElementById("player");
const buttonOpenNewVideo = document.getElementById("menu-new");
const buttonTop = document.getElementById("menu-top");
const buttonOpacity = document.getElementById("menu-opacity");
const opacityRange = document.getElementById("menu-opacity-range");
const buttonRepeat = document.getElementById("menu-repeat");
const playerInjectScriptPath = "file://" + (isDevMode ? path.resolve(__dirname, "./player.js") : remote.app.getAppPath() + "/src/js/player.js");

const DOMClasses = {
  itemActive: "menu__item--active"
};


// Inject script into player container
player.setAttribute("preload", playerInjectScriptPath);


// Event Listeners

// On paste event
document.addEventListener("paste", (event) => {
  const clipboardText = event.clipboardData.getData("text/plain");
  const YouTubeID = parseYouTubeID(clipboardText);

  if (YouTubeID) {
    app.openPlayer(YouTubeID);
  } else {
    app.generateError("Сan’t get video data from address: " + clipboardText);
  }
});

// Remove context menu
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  return false;
}, false);

// Add platform class to body
ipc.on("process:platform", (event, platform) => document.body.classList.add("platform-" + platform));

// On DOM ready webview event
player.addEventListener("dom-ready", () => {
  process.env.NODE_ENV === "development" && player.openDevTools();

  // Send to webview command that Media Play/Pause button pressed
  ipc.on("key:press:mediaplaypause", () => player.send("player:command:mediaplaypause"));
});

// "Open New Video" button logic
buttonOpenNewVideo.addEventListener("click", () => app.closePlayer());

// "Always on top" button logic
buttonTop.addEventListener("click", () => {
  buttonTop.classList.toggle(DOMClasses.itemActive);
  app.alwaysOnTop = !app.alwaysOnTop;
});

// "Opacity" button logic
opacityRange.addEventListener("input", (event) => {
  app.opacity = parseFloat(event.target.value) / 100;
  buttonOpacity.classList.toggle(DOMClasses.itemActive, app.opacity !== 1);
});

// "Repeat video" button logic
buttonRepeat.addEventListener("click", () => {
  buttonRepeat.classList.toggle(DOMClasses.itemActive);
  app.videoRepeat = !app.videoRepeat;
});


// Functions

/**
 * Parse YouTube ID from string
 * @param text - string for parsing
 * @return {string|null} - return null if it can't be parsed
 */
function parseYouTubeID(text) {
  let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = text.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  return null;
}