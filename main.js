/*
 * @Author: junjie.lean
 * @Date: 2020-06-30 13:49:56
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-09 14:37:07
 */

const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
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
    isDev ? this.webContents.openDevTools() : null;
    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

app.whenReady().then(() => {
  let location = isDev
    ? "http://localhost:5000"
    : `file://${__dirname}/build/index.html`;
  let mainWindow = new AppWindow({}, location);
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

  const isMac = process.platform === "darwin";

  const template = [
    ...(isMac
      ? [
          {
            label: "本地音乐播放器",
            submenu: [
              { role: "关于" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },

    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (isDev) {
    const elemon = require("elemon");
    elemon({
      app: app,
      mainFile: "main.js",
      bws: [{ bw: mainWindow, res: ["http://localhost:5000"] }],
    });
  }
});
