/*
 * @Author: junjie.lean
 * @Date: 2020-01-09 14:17:37
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-02 10:12:46
 */

// import "core-js";
import React from "react";
import { render } from "react-dom";
import App from "./view/public/public-provider";
import './style/index.scss';
// import PCP from "./util/plugin-cross-platform";
document.title = "我的音乐播放器";
render(<App />, document.querySelector('#app'));

//跨项目通讯相关,考务项目需求,非考务项目或非必要需求可以注释!
// PCP();
