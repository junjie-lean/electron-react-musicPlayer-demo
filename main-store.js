/*
 * @Author: junjie.lean
 * @Date: 2020-07-02 13:55:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-03 14:10:54
 */

const Store = require("electron-store");

const { v4: uuidv4 } = require("uuid");
const { basename } = require("path");

module.exports = class DataStore extends Store {
  constructor(settings) {
    super(settings);
    this.tracks = [];
  }
  saveTracks() {
    this.set("tracks", this.tracks);
    return this.getTracks();
  }
  getTracks() {
    return this.get("tracks") || [];
  }
  addTrack(tracks) {
    const tracksWithProps = tracks
      .map((tracks) => ({
        id: uuidv4(),
        path: tracks,
        fileName: basename(tracks),
      }))
      .filter((tracks) => {
        const currentPath = this.getTracks().map((tracks) => tracks.path);
        return currentPath.indexOf(tracks.path) < 0;
      });
    this.tracks = [...this.tracks, ...tracksWithProps];
    return this.saveTracks();
  }
  deleteTrack(id) {
    this.tracks = this.tracks.filter((item) => item.id != id);
    return this.saveTracks();
  }
};
