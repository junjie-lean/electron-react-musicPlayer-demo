/*
 * @Author: junjie.lean
 * @Date: 2020-06-30 13:49:56
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-02 16:35:44
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
    //   event.reply("get-music-main", currentFileList);
    event.returnValue = currentFileList;
  });
});
