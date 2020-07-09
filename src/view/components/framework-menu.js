/*
 * @Author: junjie.lean
 * @Date: 2020-07-09 11:02:48
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-09 14:28:22
 */

import React, { useEffect, useEtate } from "react";
import { withRouter } from "react-router-dom";
const process = window.require("process");
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;
const isMacOs = process.platform === "darwin";

export default withRouter((props) => {
  const [isMac] = useState(isMacOs);
  useEffect(() => {
    const frameworkMenuList = [
      ...(isMac
        ? [
            {
              label: "本地音乐播放器",
              submenu: [
                { role: "about" },
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
                  submenu: [
                    { role: "startspeaking" },
                    { role: "stopspeaking" },
                  ],
                },
              ]
            : [
                { role: "delete" },
                { type: "separator" },
                { role: "selectAll" },
              ]),
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
            label: "更多",
            click: async () => {
              const { shell } = require("electron");
              await shell.openExternal("https://electronjs.org");
            },
          },
        ],
      },
      {
        label: "中文测试",
        submenu: [
          { role: "services", label: "服务" },
          { role: "about", label: "关于" },
          { type: "separator" },
          { role: "quit", label: "退出" },
        ],
      },
    ];

    const menu = new Menu();
    for (let onemenu of frameworkMenuList) {
      menu.append(new MenuItem(onemenu));
    }
    window.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        menu.popup({ window: remote.getCurrentWindow() });
      },
      false
    );
  }, []);

  const createFrameworkMenu = () => {
    return null;
  };

  return createFrameworkMenu();
});
