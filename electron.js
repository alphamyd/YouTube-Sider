const electron = require("electron");
const path = require("path");
const url = require("url");

const { app, BrowserWindow, dialog, globalShortcut, shell } = electron;

const isDevMode = process.env.NODE_ENV === "development";

// Reference of the window object
let mainWindow;

const createWindow = () => {
  // Init main app window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 450,
    minWidth: 320,
    minHeight: 230,
    center: true,
    focusable: true,
    webPreferences: {
      webviewTag: true,
      webSecurity: false,
      nodeIntegration: true
    }
  });

  // Disable menu
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);

  // Load index.html (or localhost in development mode)
  mainWindow.loadURL(
    isDevMode
      ? "http://localhost:3000/"
      : url.format({ pathname: path.join(app.getAppPath(), "/frontend/index.html"), protocol: "file:", slashes: true })
  );

  // Open the DevTools in development mode
  isDevMode && mainWindow.webContents.openDevTools();

  // Prevent link opening
  let handleRedirect = (event, url) => {
    if(url !== mainWindow.webContents.getURL()) {
      event.preventDefault();
      return false;
    }
  };

  mainWindow.webContents.on("will-navigate", handleRedirect);
  mainWindow.webContents.on("new-window", handleRedirect);

  // Emitted when the window is closed.
  mainWindow.on("closed", () => mainWindow = null);

  // Emitted when document was loaded
  mainWindow.webContents.on("did-finish-load", () => {
    // Send platform info to renderer process
    mainWindow.webContents.send("process:platform", process.platform);
  });

  // Register global shortcuts
  // Shortcut for "About" dialog box
  globalShortcut.register("Shift+~", () => {
    dialog.showMessageBox(mainWindow, {
      type: "none",
      title: "About & Help",
      buttons: ["Go to homepage"],
      cancelId: 777,
      message: "YouTube Sider - watch YouTube videos without distracting from work.",
      detail: "Shortcuts:\nIn order to play or pause the video, you can press Play/Pause Media Key on your keyboard. Alternative, you can press Shift plus Play/Pause Media Key\nIf you start more than one instance of app for Play (or Pause) you can use Shift plus F1 (for first instance), Shift plus F2 (for second) and etc (up to 4 instancies).\n\nDeveloped by alphamyd."
    }, (response) => {
      // if button "Got to homepage" clicked
      if (response === 0) {
        shell.openExternal("https://github.com/alphamyd/youtube-sider");
      }
    });
  });

  // Shortcut for "Play/Pause" key
  globalShortcut.register("MediaPlayPause", mediaPlayPauseHandler);
  globalShortcut.register("Shift+MediaPlayPause", mediaPlayPauseHandler);

  // Shortcut for multiple press "Play/Pause"
  for (let i = 1; i <= 4; i++) {
    let keyForBinding = "Shift+F" + i;

    if (globalShortcut.register(keyForBinding, mediaPlayPauseHandler)) {
      break;
    }
  }

  function mediaPlayPauseHandler() {
    // Send key press info to renderer process
    mainWindow.webContents.send("key:press:mediaplaypause");
  }
};

// Emitted when the app is ready to create browser window
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }

  globalShortcut.unregisterAll();
});

// Re-create window (only for macOS)
app.on("activate", () => {
  if (mainWindow === null)
    createWindow();
});