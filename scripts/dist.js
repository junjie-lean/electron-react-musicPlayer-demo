/*
 * @Author: junjie.lean
 * @Date: 2020-07-06 17:12:13
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-06 17:15:20
 */

const spawn = require("cross-spawn");

let compileMain = spawn("webpack");

compileMain.stdout.on("data", (data) => {
  console.log(data.toString());
});

compileMain.stderr.on("data", (data) => {
  console.log(data.toString());
});

compileMain.on("close", (code) => {
  console.log(code);
});
let compileElectron = spawn("electron-builder");

compileElectron.stdout.on("data", (data) => {
  console.log(data.toString());
});

compileElectron.stderr.on("data", (data) => {
  console.log(data.toString());
});

compileElectron.on("close", (code) => {
  console.log(code);
});
