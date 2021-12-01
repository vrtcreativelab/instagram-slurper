const electron = require("electron");
const express = require("express");
const presenter = express();
const http = require("http");
const freeport = require("find-free-port");

const server = http.createServer(presenter);
const { Server } = require("socket.io");
const io = new Server(server);

const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let currentHighlights = [];

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
    },
  });
  mainWindow.setMenu(null);

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("app:set-highlights", (event, highlights) => {
  currentHighlights = highlights;
  io.emit("highlights", highlights);
});

ipcMain.handle("app:get-highlights", (event) => {
  return currentHighlights;
});

presenter.use(express.static(path.join(__dirname, "../presenter")));

presenter.get("/highlights", (req, res) => {
  res.send(currentHighlights ? currentHighlights : []);
});

freeport(3001)
  .then(([freep]) => {
    server.listen(freep, () => {
      console.log(`listening on *:${freep}`);
      require("dns").lookup(require("os").hostname(), function (err, add, fam) {
        ipcMain.handle("app:open-presenter", (event) => {
          require("electron").shell.openExternal(`http://${add}:${freep}`);
        });
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });
