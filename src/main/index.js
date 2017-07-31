import { app, BrowserWindow } from "electron";
import dateFns from "date-fns";

const maxCheckInterval = 60000;

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
let nextTrigger = null;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function main() {
  app.dock.hide();
  calculateNextTrigger();
  checkTime();
}

function calculateNextTrigger() {
  const current = new Date();
  // If there's no trigger yet, or it is in the past:
  if (!dateFns.isDate(nextTrigger) || dateFns.isAfter(current, nextTrigger)) {
    const triggerToday = dateFns.addMinutes(
      dateFns.addHours(dateFns.startOfToday(), 11),
      59
    );
    // todays trigger was already
    if (dateFns.isAfter(current, triggerToday)) {
      nextTrigger = dateFns.addDays(triggerToday, 1);
    } else {
      nextTrigger = triggerToday;
    }
  }
}

function checkTime() {
  const current = new Date();
  if (dateFns.isAfter(current, nextTrigger)) {
    createWindow();
    calculateNextTrigger();
  }
  const nextCheck = Math.min(
    maxCheckInterval,
    Math.abs(dateFns.differenceInMilliseconds(current, nextTrigger))
  );
  setTimeout(checkTime, nextCheck);
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
