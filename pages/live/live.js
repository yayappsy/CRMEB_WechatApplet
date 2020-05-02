// pages/live/live.js
const app = getApp();

import { getIndexData, getCoupons, getTemlIds, getLiveList } from '../../api/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '直播视频',
      'color': false
    },
    liveList: [],
    liveInfo: {},
    videoList: [
      { name: '寻蜜陕西', desc: '寻蜜人生食品旗舰店', url: 'u2f82j573nxfy3rcnodxr4vt4qhb1xye.mp4', picUrl:'../../images/video_pic.png'  },
      { name: '寻蜜西双版纳', desc: '寻蜜人生食品旗舰店', url: '9ifsxrm9d741t6ywko8l03va6u0r52dr.mp4', picUrl: '../../images/video_pic.png' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLiveList();
  },

  getLiveList: function () {
    getLiveList(1, 20).then(res => {
      if (res.data.length == 1) {
        this.setData({ liveInfo: res.data[0] });
      } else {
        this.setData({ liveList: res.data });
      }
    }).catch(res => {

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