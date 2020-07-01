/*
 * @Author: junjie.lean 
 * @Date: 2020-06-30 13:49:56 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-01 11:00:40
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');

class AppWindow extends BrowserWindow {
    constructor(config, location) {
        const baseConifg = {
            width: 1000,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            },
            show: false
        };
        const effectConfig = { ...baseConifg, ...config };
        super(effectConfig)
        this.loadURL(location);
        // this.webContents.openDevTools()
        this.once('ready-to-show', () => {
            this.show()
        })
    }
};


app.whenReady().then(() => {
    let mainWindow = new AppWindow({}, "http://localhost:5000");
});