// pages/messages/message.js
import { getUserInfo, userActivity } from '../../api/user.js';

var websocket = require('../../utils/websocket.js');
const myaudio = wx.createInnerAudioContext();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '寻蜜人生',    //此处应设为对话时对方昵称
      'color': false
    },
    scrollTop: 0,

    //histMessage 对话数据，包含user，id，avatar,type等等,此数据在app加载时，读取，并且实时消息应同步到数据库
    histMessage: [
      { 'nickName': '邓杰', 'avatar': '../../images/logo.png', 'type': 'text', 'content': '您好，请问这个可以优惠一点吗', 'date': '20200315' },
      { 'nickName': '邓杰', 'avatar': '../../images/logo.png', 'type': 'image', 'images': '../../images/down.png' },
      { 'nickName': '寻蜜人生', 'avatar': '../../images/one.png', 'type': 'voice', 'time': '30s', 'bl': false, 'content': '不行哦', 'date': '20200315' },
      //{ 'nickName': '寻蜜人生', 'avatar': '../../images/one.png', 'type': 'video', 'url': 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400' },

    ],
    curMessage: '',
    userInfo: {},
    previewImgList: [],
    increase: false,
    aniStyle: true,
    ctx: {},
    currentTab: 0,//顶部当前索引
    focusFlag: false,//控制输入框失去焦点与否
    emojiFlag: false,//emoji键盘标志位
    inputValue: '', // 发送的文本内容

  },

  /**
   * 
   */

  //音频播放  
  audioPlay(e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      key = e.currentTarget.dataset.key,
      audioArr = that.data.audioArr;
  
    //设置状态
    audioArr.forEach((v, i, array) => {
      v.bl = false;
      if (i == key) {
        v.bl = true;
      }
    })
    that.setData({
      audioArr: audioArr,
      audKey: key,
    })

    myaudio.autoplay = true;
    var audKey = that.data.audKey,
        vidSrc = audioArr[audKey].src;
    myaudio.src = vidSrc;
    
    myaudio.play();

    //开始监听
    myaudio.onPlay(() => {
      console.log('开始播放');
    })

    //结束监听
    myaudio.onEnded(() => {
      console.log('自动播放完毕');
      audioArr[key].bl = false;
      that.setData({
        audioArr: audioArr,
      })
    })

    //错误回调
    myaudio.onError((err) => {
      console.log(err); 
      audioArr[key].bl = false;
      that.setData({
        audioArr: audioArr,
      })
      return
    })

  },

  // 音频停止
  audioStop(e){
    var that = this,
      key = e.currentTarget.dataset.key,
      audioArr = that.data.audioArr;
    //设置状态
    audioArr.forEach((v, i, array) => {
      v.bl = false;
    })
    that.setData({
      audioArr: audioArr
    })

    myaudio.stop();

    //停止监听
    myaudio.onStop(() => {
      console.log('停止播放');
    })

  }, 
  /**
  * 返回上一界面
  */
  return: function () {
    wx.navigateBack();
  },

  /**
  * 图片预览
  */
  previewImg: function (e) {
    var that = this
    console.log(e)
    var res = e.target.dataset.src
    var list = that.data.previewImgList
    if (list.indexOf(res) == -1) {
      that.data.previewImgList.push(res)
    }
    wx.previewImage({
      current: res,
      urls: that.data.previewImgList
    })
  },

  /**
   * 点击头像，详情界面
   * 1，如果是用户点击商家头像，去到店铺界面
   * 2，如果是商家点用户头像，去到记录界面
   * 3，自己点自己头像，则去到个人设置界面
   */
  showUserDetail: function () {
    wx.navigateTo({
      url: '../user_details/detail'
    })
  },

  /**
   * 发送文字
   */
  inputSend: function () {
    var that = this
    if (that.data.curMessage == {}) {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      setTimeout(function () {
        this.setData({
          curMessage: {
            "content": res.data,
            "date":new Date(),
            "type":"text",
            "nickName":that.data.userInfo.nickName,
            "avatarUrl":that.data.userInfo.avatar,
          },
          //that.data.histMessage.push(that.data.curMessage),
          increase: false
        })
      }, 500)
      that.chat.send(that.data.curMessage)
      that.bottom()
    }
  },
  /**
   * 发送商品链接
   */
  shareGoodLink: function (res) {
    var that=this
    this.setData({
      curMessage: {
        "content": res.data,
        "date":new Date(),
        "type":"link",
        "nickName":that.data.userInfo.nickName,
        "avatarUrl":that.data.userInfo.avatar
      },
      //curMessage 应该转换为json字符串，放到histMessage?
      //that.data.histMessage.push(that.data.curMessage)
    })
    websocket.send(this.data.curMessage)
    that.bottom()
  },
  /**
   * 打开相册选择图片
   */
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: WSS_SERVER_URL, //服务器地址
          filePath: tempFilePaths[0],
          name: 'file',
          headers: HEADER,
          success: function (res) {
            if (res.data) {
              that.setData({
                curMessage:'{"content":"' + res.data + '","date":"' + (new Date()) + '","type":"image","nickName":"' + that.data.userInfo.nickName + '","avatar":"' + that.data.userInfo.avatar + '"}',
                //curMessage 应该转换为json字符串，放到histMessage?
                //that.data.histMessage.push(that.data.curMessage),
                increase: false
              })
              // 数据同步后端，更新到数据库
              websocket.send(that.data.curMessage)
              that.bottom()
            }
          }
        })
      }
    })
  },
  /**
   * 拍照
   */
  takePicture: function () {
    var that = this
    console.log('拍照')
    that.data.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: WSS_SERVER_URL, //服务器地址
          filePath: tempFilePaths[0],
          name: 'file',
          headers: HEADER,
          success: function (res) {
            if (res.data) {
              that.setData({
                curMessage: '{"content":"' + res.data + '","date":"' + (new Date()) + '","type":"image","nickName":"' + that.data.userInfo.nickName + '","avatar":"' + that.data.userInfo.avatar + '"}',
                //curMessage 应该转换为json字符串，放到histMessage?
                //that.data.histMessage.push(that.data.curMessage),
                increase: false
              })
              // 数据同步后端，更新到数据库
              websocket.send(that.data.curMessage)
              that.bottom()
            }
          }
        })
      }
    })
  },

  /**
   * 发送视频
   */
  chooseVideo: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: WSS_SERVER_URL, //服务器地址
          filePath: tempFilePaths[0],
          name: 'file',
          headers: HEADER,
          success: function (res) {
            if (res.data) {
              that.setData({
                curMessage:'{"content":"' + res.data + '","date":"' + (new Date()) + '","type":"image","nickName":"' + that.data.userInfo.nickName + '","avatar":"' + that.data.userInfo.avatar + '"}',
                //curMessage 应该转换为json字符串，放到histMessage?
                //that.data.histMessage.push(that.data.curMessage),
                increase: false
              })
              // 数据同步后端，更新到数据库
              websocket.send(that.data.curMessage)
              that.bottom()
            }
          }
        })
      }
    })
  },

  /**
   * 选择并发送位置，发送暂未实现
   */
  choosePosition: function() {
    wx.chooseLocation({
      success(res) {
        that.city = res.name;
        that.latitude = res.latitude;
        that.longitude = res.longitude;
      }
    })
  },
  //聊天消息始终显示最底端
  bottom: function () {
    var that = this
    wx.createSelectorQuery().select('#recordWrapper').boundingClientRect(function (rect) {
      if (rect.bottom > that.data.messageWrapperMaxHeight) {
        that.setData({
          scrollTop: 999999
        })
      }
    }).exec()
  },

  /**
   * 输入事件
   */
  inputChange(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 获取焦点
   */
  inputFocus(e) {
    this.setData({
      emojiFlag: false,
      focusFlag: true
    })
  },

  /**
  * 失去焦点
  */
  inputBlur() {
    this.setData({
      focusFlag: false
    })
  },
  
  /**
   * 切换出emoji键盘
   */
  toggleEmoji() {
    this.setData({
      emojiFlag: !this.data.emojiFlag,
      moreFlag: false
    })
  },
  /**
   * 切出更多
   */
  toggleMore() {
    this.setData({
      moreFlag: !this.data.moreFlag,
      emojiFlag: false,
      focusFlag: false
    })
  },
  /**
   * emoji组件回调
   */
  emojiCLick(e) {
    let val = e.detail
    // 单击删除按钮，，删除emoji
    if (val == '[删除]') {
      let lastIndex = this.data.inputValue.lastIndexOf('[')
      if (lastIndex != -1) {
        this.setData({
          inputValue: this.data.inputValue.slice(0, lastIndex)
        })
      }
      return
    }
    if (val[0] == '[') { // emoji
      this.setData({
        inputValue: this.data.inputValue + val
      })
    }
  },
  /**
   * emoji点击发送
   */
  emojiSend(e) {
    let val = this.data.inputValue
    this.sendRequest(val)
    this.setData({
      emojiFlag: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        ctx: wx.createCameraContext()
      })
    }
    //调通接口
    websocket.connect(this.data.userInfo, function (res) {
    // console.log(JSON.parse(res.data))
      var list = []
      list = that.data.histMessage
      list.push(JSON.parse(res.data))
      that.setData({
        histMessage: list
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket();
    wx.showToast({
      title: '连接已断开~',
      icon: "none",
      duration: 2000
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})