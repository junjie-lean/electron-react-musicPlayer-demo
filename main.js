/*
 * @Author: junjie.lean
 * @Date: 2020-06-30 13:49:56
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-03 15:06:11
 */

const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const Store = require("./main-store");
const myStore = new Store();

class AppWindow extends BrowserWindow {
  constructor(config, location) {
    const baseConifg = {
      width: 1100,
      height: 700,
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
  let mainWindow = new AppWindow({}, "http://localhost:5000");

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
    let currentFileList = myStore.addTrack(content).getTracks();
    event.returnValue = currentFileList;
  });

  ipcMain.on("delete-music-window", (event, content) => {
    let {id} = content;
    let currentFileList = myStore.deleteTrack(id).getTracks();
    event.returnValue = currentFileList;
  });
});
