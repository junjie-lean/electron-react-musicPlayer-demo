/*
 * @Author: junjie.lean
 * @Date: 2020-07-01 11:04:30
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-10 17:22:30
 */

import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import { Button, Modal, Alert, message, Progress } from "antd";
import Scrollbar from "react-perfect-scrollbar";
import FrameworkMenu from "./../components/framework-menu";
import {
  PlayCircleOutlined,
  PlusSquareOutlined,
  SelectOutlined,
  FileAddOutlined,
  AppstoreAddOutlined,
  CustomerServiceOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { dialog, remote, ipcRenderer } = window.require("electron");
const path = window.require("path");
const fs = window.require("fs");
const { Buffer } = window.require("buffer");
const process = window.require("process");

export default withRouter(() => {
  const [addMusicModal, setAddMusicModal] = useState(false);
  const [tmpFileSelectList, setTmpFileSelectList] = useState([]);
  const [allFileList, setAllFileList] = useState([]);
  const [currentPlay, setCurrentPlay] = useState({});
  const [isRenderPlayProgress, setRenderPlayProgress] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0); //歌曲的当前播放时长 秒
  const [currentPlayTotalTime, setCurrentPlayTotalTime] = useState(0); //当前播放歌曲的总时长  秒

  const myPlayer = useRef(new Audio()); //播放器实例
  myPlayer.current.volume = 0.5;
  myPlayer.current.addEventListener("timeupdate", (e) => {
    setCurrentPlayTime(Math.round(myPlayer.current.currentTime));
  });
  myPlayer.current.addEventListener("loadeddata", (e) => {
    setCurrentPlayTotalTime(Math.round(myPlayer.current.duration));
  });

  const closeAddMusicModal = () => {
    setTmpFileSelectList([]);
    setAddMusicModal(false);
  };

  const chooseFileDialog = () => {
    let fileSelect = ipcRenderer.sendSync("select-music-window");
    if (!fileSelect.canceled) {
      let arr = [...tmpFileSelectList].concat(fileSelect.filePaths);
      arr = [...new Set(arr)];
      // console.log(arr)
      setTmpFileSelectList(arr);
    }
  };

  const importFile = () => {
    if (!tmpFileSelectList.length) {
      message.warning("未选择音乐!");
      return false;
    }
    let importSelect = ipcRenderer.sendSync(
      "import-music-window",
      tmpFileSelectList
    );

    setAllFileList(importSelect);
    closeAddMusicModal();
  };

  const setCurrentPlayDOM = (currentPlay) => {
    if (isRenderPlayProgress) {
    } else {
      if (currentPlay && currentPlay.id) {
        setRenderPlayProgress(true);
      }
    }
  };

  const deleteMusic = (id) => {
    let result = ipcRenderer.sendSync("delete-music-window", { id });
    setAllFileList(result);
  };

  const playOrPause = (item) => {
    if (currentPlay.id !== item.id) {
      setCurrentPlay({
        playState: "play",
        ...item,
      });
      const musicReader = () => {
        const muiscFile =
          "data:audio/wav;base64," +
          Buffer.from(fs.readFileSync(item.path)).toString("base64");
        return muiscFile;
      };
      myPlayer.current.src = musicReader(item.path);
      myPlayer.current.play();
    } else if (currentPlay.playState === "pause") {
      setCurrentPlay({
        playState: "play",
        ...item,
      });
      myPlayer.current.play();
    } else if (currentPlay.playState === "play") {
      setCurrentPlay({
        playState: "pause",
        ...item,
      });
      myPlayer.current.pause();
    }
  };

  const parseTime = (second) => {
    let time = "";
    if (second < 60) {
      time = `00:${second < 10 ? "0" + second : second}`;
    } else if (second > 60 * 60) {
      //歌曲时长大于一小时
      //
    } else {
      let Minues = "0" + Math.floor(second / 60);
      let Second = "0" + Math.floor(second % 60);
      time = Minues.slice(-2) + ":" + Second.slice(-2);
    }
    return time;
  };

  const dragFile = (e) => {
    e.preventDefault();
    let {
      dataTransfer: { files },
    } = e;
    let fileArr = [];
    for (let file of files) {
      if (file && file.path) {
        if (path.extname(file.path) !== ".mp3") {
          message.warning("请选择以mp3结尾的文件");
          return false;
        }
        fileArr.push(file.path);
        // fileArr.push(tmpFileSelectList.path);
      }
    }
    setTmpFileSelectList(fileArr);
  };

  useEffect(() => {
    setCurrentPlayDOM(currentPlay);
  }, [currentPlay]);

  useEffect(() => {
    ipcRenderer.on("get-music-main", (event, content) => {
      setAllFileList(content);
    });
  }, []);

  const consoleScreen = () => {
    console.log(remote.screen.getAllDisplays());
    console.log(remote.screen.getPrimaryDisplay());
  };
  return (
    <div className="lean-music-content">
      <FrameworkMenu />
      <h3
        onClick={() => {
          console.clear();
          consoleScreen();
        }}
      >
        本地音乐播放器
      </h3>
      <Button
        type="primary"
        style={{ width: "90%", margin: "30px auto", display: "block" }}
        onClick={() => {
          setAddMusicModal(true);
        }}
      >
        <PlusSquareOutlined />
        添加音乐
      </Button>
      <div style={{ width: "90%", margin: "0 auto" }}>
        {allFileList.length == 0 ? (
          <div>请添加本地音乐</div>
        ) : (
          <div style={{ padding: "20px 0" }}>
            <Scrollbar style={{ height: 500 }}>
              {allFileList.map((item, index) => {
                return (
                  <p key={index} className="lean-music-list-item">
                    <span>
                      <CustomerServiceOutlined
                        spin={item.id === currentPlay.id}
                      />
                    </span>
                    <span>{item.fileName}</span>
                    <span
                      onClick={() => {
                        playOrPause(item);
                      }}
                    >
                      {currentPlay.id === item.id &&
                      currentPlay.playState === "play" ? (
                        <PauseCircleOutlined />
                      ) : (
                        <PlayCircleOutlined />
                      )}
                    </span>
                    <span
                      onClick={() => {
                        deleteMusic(item.id);
                      }}
                    >
                      <DeleteOutlined />
                    </span>
                  </p>
                );
              })}
            </Scrollbar>
          </div>
        )}
      </div>
      {isRenderPlayProgress ? (
        <div className="lean-progressContent">
          <div className="lean-time-info">
            <span>{path.basename(currentPlay.fileName, ".mp3")}</span>
            <span>
              {parseTime(currentPlayTime)} / {parseTime(currentPlayTotalTime)}
            </span>
          </div>
          <Progress
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            status="active"
            showInfo={false}
            percent={
              Math.round((currentPlayTime / currentPlayTotalTime) * 10000) / 100
            }
          />
        </div>
      ) : (
        <div></div>
      )}
      <Modal
        style={{
          width: "60%",
          minWidth: "800px",
        }}
        visible={addMusicModal}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setAddMusicModal(false);
        }}
        maskClosable={false}
        mask={false}
        closable={false}
      >
        <p style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            className="lean-addMusic-headerMusic"
            type="primary"
            onClick={chooseFileDialog}
          >
            <AppstoreAddOutlined />
            选择音乐
          </Button>
          <Button
            className="lean-addMusic-headerMusic"
            type="primary"
            onClick={importFile}
          >
            <FileAddOutlined />
            导入音乐
          </Button>
          <Button
            className="lean-addMusic-headerMusic"
            type="primary"
            onClick={closeAddMusicModal}
          >
            <SelectOutlined />
            取消
          </Button>
        </p>

        <Scrollbar style={{ height: "300px" }}>
          {tmpFileSelectList.length == 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="lean-music-dragWrapper"
              onDrop={dragFile}
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              <p>请开始选择音乐,可以直接拖动mp3文件到这里!</p>
            </div>
          ) : null}
          {tmpFileSelectList.length > 0 &&
            tmpFileSelectList.map((item, index) => {
              return (
                <div key={index}>
                  <Alert
                    message={path.basename(item, ".mp4")}
                    type="info"
                    style={{
                      margin: "15px 0",
                      borderRadius: 3,
                      userSelect: "none",
                    }}
                    showIcon
                  />
                </div>
              );
            })}
        </Scrollbar>
      </Modal>
    </div>
  );
});
