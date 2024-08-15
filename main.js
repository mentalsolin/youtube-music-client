const { app, BrowserWindow, ipcMain, nativeImage, Menu } = require("electron");
const path = require("path");

let mainWindow;
let isPlaying = false;
let isLiked = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: true,
  });

  mainWindow.loadURL("https://music.youtube.com/");
  Menu.setApplicationMenu(null);

  updateThumbarButtons(false);

  mainWindow.on("close", (event) => {
    mainWindow.webContents.send("media-play-pause");
    app.quit();
  });
}

function updateThumbarButtons(isTrackSelected) {
  const radioIconPath = path.join(__dirname, "icons", "radio.png");
  const playPauseIconPath = path.join(
    __dirname,
    "icons",
    isPlaying ? "pause.png" : "play.png"
  );
  const prevIconPath = path.join(__dirname, "icons", "prev.png");
  const nextIconPath = path.join(__dirname, "icons", "next.png");
  const likeIconPath = path.join(
    __dirname,
    "icons",
    isLiked ? "like.png" : "like-fill.png"
  );

  const radioIcon = nativeImage.createFromPath(radioIconPath);
  const playPauseIcon = nativeImage.createFromPath(playPauseIconPath);
  const prevIcon = nativeImage.createFromPath(prevIconPath);
  const nextIcon = nativeImage.createFromPath(nextIconPath);
  const likeIcon = nativeImage.createFromPath(likeIconPath);

  mainWindow.setThumbarButtons([
    {
      tooltip: "Start radio",
      icon: radioIcon,
      click() {
        mainWindow.webContents.send("media-radio-track");
      },
      flags: isTrackSelected ? [] : ["disabled"],
    },
    {
      tooltip: "Previous",
      icon: prevIcon,
      click() {
        mainWindow.webContents.send("media-previous-track");
      },
      flags: isTrackSelected ? [] : ["disabled"],
    },
    {
      tooltip: isPlaying ? "Pause" : "Play",
      icon: playPauseIcon,
      click() {
        mainWindow.webContents.send("media-play-pause");
      },
    },
    {
      tooltip: "Next",
      icon: nextIcon,
      click() {
        mainWindow.webContents.send("media-next-track");
      },
      flags: isTrackSelected ? [] : ["disabled"],
    },
    {
      tooltip: isLiked ? "Like" : "Unlike",
      icon: likeIcon,
      click() {
        mainWindow.webContents.send("like-track");
      },
      flags: isTrackSelected ? [] : ["disabled"],
    },
  ]);
}

ipcMain.on("update-thumbar-buttons", (event, { isTrackSelected }) => {
  updateThumbarButtons(isTrackSelected);
});

ipcMain.on("update-play-pause", (event, playing) => {
  isPlaying = playing;
  updateThumbarButtons(true);
});

ipcMain.on("update-like-button", (event, liked) => {
  isLiked = liked;
  updateThumbarButtons(true);
});

app.on("ready", createWindow);

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
