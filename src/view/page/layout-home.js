/*
 * @Author: junjie.lean
 * @Date: 2020-07-01 11:04:30
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-02 16:19:34
 */

import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Modal, Alert, message } from "antd";
import Scrollbar from "react-perfect-scrollbar";

const { dialog, remote, ipcRenderer } = window.require("electron");
const path = window.require("path");
export default withRouter(() => {
  const [addMusicModal, setAddMusicModal] = useState(false);
  const [tmpFileSelectList, setTmpFileSelectList] = useState([]);
  const [allFileList, setAllFileList] = useState([]);

  const closeModal = () => {
    setTmpFileSelectList([]);
    setAddMusicModal(false);
  };

  const chooseFileDialog = () => {
    let fileSelect = ipcRenderer.sendSync("select-music-window");
    if (!fileSelect.canceled) {
      let arr = [...tmpFileSelectList].concat(fileSelect.filePaths);
      arr = [...new Set(arr)];
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
    closeModal();
  };

  useEffect(() => {
    ipcRenderer.on("get-music-main", (event, content) => {
      setAllFileList(content);
    });
  }, []);

  return (
    <div className="lean-music-content">
      <h3>本地音乐播放器</h3>
      <Button
        type="primary"
        style={{ width: "80%", margin: "0 auto", display: "block" }}
        onClick={() => {
          setAddMusicModal(true);
        }}
      >
        添加音乐
      </Button>
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
            选择音乐
          </Button>
          <Button className="lean-addMusic-headerMusic" onClick={importFile}>
            导入音乐
          </Button>
          <Button className="lean-addMusic-headerMusic" onClick={closeModal}>
            取消
          </Button>
        </p>

        <Scrollbar style={{ height: "300px" }}>
          {tmpFileSelectList.length == 0 ? <p>请开始选择音乐</p> : null}
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
