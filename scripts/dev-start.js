/*
 * @Author: junjie.lean
 * @Date: 2020-01-10 11:06:12
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-07 10:28:34
 */

/**
 * 启动脚本
 */

//  windows兼容:
const spawn = require("cross-spawn");
// const {spawn} = require("child_process");
// console.log(process.env.NODE_ENV);
// webpack-dev-server --config ./config/webpack.base.config --color

let startDevServer = spawn(
  "npx",
  ["webpack-dev-server", "--config", "./config/webpack.base.config", "--color"],
  {
    env: { ...process.env },
  }
);

startDevServer.stdout.on("data", (data) => {
  console.log(data.toString());
});

startDevServer.stderr.on("data", (data) => {
  console.log(data.toString());
});

startDevServer.on("close", (code) => {
  // console.log(code);
});

// "nodemon --watch main.js --exec 'electron .'"
// let startElectron = spawn("nodemon", [
//   "--watch",
//   "main.js",
//   "--exec",
//   "electron",
//   ".",
// ]);

let startElectron = spawn("electron", ["."]);

startElectron.stdout.on("data", (data) => {
  console.log(data.toString());
});

startElectron.stderr.on("data", (data) => {
  console.log(data.toString());
});

startElectron.on("close", (code) => {
  // console.log(code);
});
