/*
 * @Author: junjie.lean
 * @Date: 2020-06-30 13:49:56
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-06 17:04:04
 */

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const Store = require("./main-store");
const myStore = new Store();
const isDev = require("electron-is-dev");

class AppWindow extends BrowserWindow {
  constructor(config, location) {
    const baseConifg = {
      width: 1360,
      height: 768,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
      show: false,
    };
    const effectConfig = { ...baseConifg, ...config };
    super(effectConfig);
    this.loadURL(location);
    this.webContents.openDevTools();
    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

app.whenReady().then(() => {
  let location = isDev ? "http://localhost:5000" : "./build/index.html";
  let mainWindow = new AppWindow({}, location);
  cosnole.log('yomi')
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.send("get-music-main", myStore.getTracks());
  });

  ipcMain.on("select-music-window", (event) => {
    dialog
      .showOpenDialog({
        title: "选择要导入的音乐",
        filters: [
          {
            name: "Music",
            extensions: ["mp3"],
          },
        ],
        buttonLabel: "确认导入",
        properties: ["openFile", "multiSelections"],
      })
      .then((fileSelectResult) => {
        event.returnValue = fileSelectResult;
      })
      .catch((e) => {
        console.log(e);
      });
  });

  ipcMain.on("import-music-window", (event, content) => {
    let currentFileList = myStore.addTrack(content);
    event.returnValue = currentFileList;
  });

  ipcMain.on("delete-music-window", (event, content) => {
    let { id } = content;
    let currentFileList = myStore.deleteTrack(id);
    event.returnValue = currentFileList;
  });

  if (isDev) {
    const elemon = require("elemon");
    elemon({
      app: app,
      mainFile: "main.js",
      bws: [{ bw: mainWindow, res: ["http://localhost:5000"] }],
    });
  }
});
