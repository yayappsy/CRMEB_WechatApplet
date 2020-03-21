// pages/messages/message.js
import { getUserInfo, userActivity } from '../../api/user.js';

var websocket = require('../../utils/websocket.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '',    //此处应设为对话时对方昵称
      'color': false
    },
    scrollTop: 0,

    //newsList 对话数据，包含user，id，avatar,type等等,此数据在app加载时，读取，并且实时消息应同步到数据库
    histMessage: [],
    curMessage: '',
    userInfo: {},
    previewImgList: [],
    increase: false,
    aniStyle: true,
    ctx: {},
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
  * 聊天界面点+展开
  */
  increase() {
    this.setData({
      increase: true,
      aniStyle: true
    })
  },

  /**
   * 点击头像，详情界面
   */
  showUserDetail: function () {
    wx.navigateTo({
      url: '../user_details/detail'
    })
  },

  /**
   * 发送文字
   */
  send: function () {
    var that = this
    if (that.data.curMessage == {}) {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      setTimeout(function () {
        that.setData({
          curMessage: {
            "content": res.data,
            "date":new Date(),
            "type":"text",
            "nickName":that.data.userInfo.nickName,
            "avatarUrl":that.data.userInfo.avatar
          },
          that.data.histMessage.push(that.data.curMessage)，
          increase: false,
        })
      }, 500)
      that.chat.send(that.data.curMessage)
      that.bottom()
    }
  },
  /**
   * 发送商品链接
   */
  shareGoodLink: function () {
    this.setData({
      curMessage: {
        "content": res.data,
        "date":new Date(),
        "type":"link",
        "nickName":that.data.userInfo.nickName,
        "avatarUrl":that.data.userInfo.avatar
      },
      //curMessage 应该转换为json字符串，放到histMessage?
      that.data.histMessage.push(that.data.curMessage)
    })
    websocket.send(this.data.curMessage)
    this.bottom()
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
                that.data.histMessage.push(that.data.curMessage),
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
                that.data.histMessage.push(that.data.curMessage)，
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
                that.data.histMessage.push(that.data.curMessage)，
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

  //聊天消息始终显示最底端
  bottom: function () {
    var query = wx.createSelectorQuery()
    query.select('#flag').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0].bottom // #the-id节点的下边界坐标
      })
      res[1].scrollTop // 显示区域的竖直滚动位置
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