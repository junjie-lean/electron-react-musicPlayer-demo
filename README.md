## 使用electron+react hook 重写本地音频播放器demo

    原demo地址:https://www.imooc.com/course/introduction/id/1198
    原demo采用的是electron + 原生js +  Bootstarp 实现
    本demo使用electron + webpack(react hook) + antd 实现
    比原视频demo修改了播放逻辑,因为在的开发模式中,new Audio()获取不到本地文件,所以使用fs.readfile读出Buffer,再转base64编码进行播放.
    增加自动发布逻辑

## 启动方式:

    `npm run dev`

## env:

    主要环境:
    node 12.17 
    electron 9.0.5
    react 16.13

