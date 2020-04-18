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
    vedioList: [
      { name: '元气少女',desc:'from bilbibli', url: 'v.youku.com', picUrl: 'https://i0.hdslb.com/bfs/live/new_room_cover/9f41d4f0375cca2bdaa35c6c175b040ae39e5d0c.jpg@257w_145h_1c_100q.webp' },
      { name: '街头惊现民乐蹦迪【加速版极乐净土·扬琴】这还是你认识的民乐吗', desc: 'hhh', url: 'www.bilibili.com/video/BV1Et4y127Ue', picUrl: 'http://i0.hdslb.com/bfs/archive/5f5e0bf7ba41256627a1418406aa915f07fd7443.jpg@200w_125h.jpg' },
      { name: '视频3', desc: '3', url: 'www.bilibili.com/video/BV19s411N7aW', picUrl: 'http://i1.hdslb.com/bfs/archive/8efd7e5c2173019b819b65bd8b1578531be4ad56.jpg@200w_125h.jpg' },
      { name: '视频4', desc: '4', url: 'www.bilibili.com/video/BV1L5411t7JE', picUrl: '//i0.hdslb.com/bfs/archive/4396d31019a79575e06a6f32e9b2c66c4f0f13e8.jpg@200w_125h.jpg' },
      { name: '视频5', desc: '5', url: '//www.bilibili.com/video/BV19C4y1p7yn', picUrl: '//i0.hdslb.com/bfs/archive/845f1397cb8d58d34b77e53c784ce1942f597d37.jpg@200w_125h.jpg' },
      { name: '视频6', desc: '6', url: '//www.bilibili.com/video/BV1p4411P75p', picUrl: '//i2.hdslb.com/bfs/archive/91b39b082e5ff87d5819b9e0515241431b0e88e7.jpg@200w_125h.jpg' }
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