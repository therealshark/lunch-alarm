import { app, BrowserWindow } from "electron";
import schedule from "node-schedule";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function main() {
  app.dock.hide();

  const pattern = "30 59 11 * * *";
  schedule.scheduleJob(pattern, createWindow);
}

function createWindow() {
  app.dock.show();
  if (mainWindow) {
    return;
  }
  mainWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    show: false
  });

  mainWindow.loadURL(winURL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    app.dock.hide();
  });
}

app.on("ready", main);
