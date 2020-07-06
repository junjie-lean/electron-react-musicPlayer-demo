/*
 * @Author: junjie.lean 
 * @Date: 2020-06-30 10:11:24 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-06 17:22:03
 */


const path = require('path');

module.exports = {
    mode:"production",
    target: "electron-main",
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, './build'),
        filename: "main.min.js"
    },
    stats:"none",
    node: {
        __dirname: false
    }
}