import { WSS_SERVER_URL, HEADER, SERVER_DEBUG, PINGINTERVAL} from './../config.js';

function connect(user, func) {
	wx.connectSocket({
		url: WSS_SERVER_URL,
		header: HEADER,
		success: function () {
			console.log('websocket连接成功~')
		},
		fail: function () {
			console.log('websocket连接失败~')
		}
	})

	wx.onSocketOpen(function (res) {
		wx.showToast({
			title: 'websocket已开通~',
			icon: "success",
			duration: 2000
		})
		//接受服务器消息
		wx.onSocketMessage(func);//func回调可以拿到服务器返回的数据
	});

	wx.onSocketError(function (res) {
		wx.showToast({
			title: 'websocket连接失败，请检查！',
			icon: "none",
			duration: 2000
		})
	})
}
//发送消息
function send(msg) {
	wx.sendSocketMessage({
		data: msg
	});
}
module.exports = {
	connect: connect,
	send: send
}