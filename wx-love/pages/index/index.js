// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [//图片地址
      '../../images/jiaodiantu/1.png',
      '../../images/jiaodiantu/2.png',
      '../../images/jiaodiantu/3.png'
    ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,//是否自动切换
    interval: 3000,//自动切换时间间隔
    duration: 1000,//滑动动画时长
    circular: true,//是否采用衔接滑动
    vertical: false,//滑动方向是否为纵向
    current: 0,//当前所在滑块的 index
    realkeyWords: [],
    contleft: 0,
    contmaxwidth: 0
  },

  /*瀑布流布局+滚屏*/
  seamless(keyWords) {
    let that = this;
    //372rpx  三行每一行的top
    var row = [0, 124, 248];
    var margin = 30;//30rpx 项目的left间距
    var fontsize = 36;//36rpx 字体大小用来计算宽度
    var arrswidth = [0, 0, 0];//三行每一项的宽度值
    var realkeyWords = [//计算好的可用数组
      // {val:"我去局,输",top:0,left:0}
    ];
    //刷新间隔(单位：ms)
    var interval = 30;
    //瀑布流计算
    //xxxrpx*设备宽度/750
    wx.getSystemInfo({
      success: function (res) {
        row = [0 * res.windowWidth / 750, 124 * res.windowWidth / 750, 248 * res.windowWidth / 750];
        margin = 30 * res.windowWidth / 750;
        fontsize = 36 * res.windowWidth / 750;
        for (var i = 0; i < 3; i++) {
          realkeyWords.push({ val: keyWords[i], top: row[i], left: margin, width: (keyWords[i].length + 2) * fontsize });
          arrswidth[i] = margin + (keyWords[i].length + 2) * fontsize;
        };
        for (var i = 3; i < keyWords.length; i++) {
          var minval = Math.min.apply(null, arrswidth);
          var minindex = 0;
          for (var j = 0; j < arrswidth.length; j++) {
            if (minval == arrswidth[j]) {
              minindex = j;
              break;
            };
          };
          var str = keyWords[i];
          realkeyWords.push({
            val: str, top: row[minindex], left: margin + minval, width: (str.length + 2) * fontsize
          });
          arrswidth[minindex] = arrswidth[minindex] + margin + (str.length + 2) * fontsize;
        };
        var contmaxwidth = Math.ceil(Math.max.apply(null, arrswidth));
        console.log("item值", realkeyWords, "最大宽度", contmaxwidth);
        that.setData({
          realkeyWords: realkeyWords,
          contmaxwidth: contmaxwidth
        });
        that.wfgdTimer = setInterval(function () {
          if (that.data.contleft <= -contmaxwidth) {
            that.setData({
              contleft: 0
            });
          } else {
            that.setData({
              contleft: that.data.contleft - 1
            });
          };
        }, interval);
        //e
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //瀑布流布局 + 滚屏 * /
    this.seamless([
      "哎哟~",
      "哎哟~",
      "嘻嘻~",
      "小傻瓜",
      "大笨蛋",
      "宝贝，加油",
      "起床喝水",
      "吃点果果",
      "走动一下",
      "出门注意安全",
      "早安亲爱的，么么哒",
      "晚安宝贝",
      "宝贝，我爱你",
      "知道啦老婆",
      "吃完歇会",
      "记得午休",
      "你早点去洗白白",
      "你不要吃那么多辣的哦",
      "帮你揉揉",
      "帮你按摩",
      "出门带齐东西",
      "你真棒",
      "你厉害",
      "困了吗",
      "早点休息",
      "搞搞猪",
      "嗯嗯",
      "爱死你了",
      "记得带伞哦~",
      "么么哒",
      "想亲你一口",
      "别受凉了哦~",
      "爱你，力量满满",
      "和你聊天",
      "珍惜每一分每一秒",
      "你的魅力征服了我",
      "遇见你是我最珍贵的人",
      "陪你过完一辈子",
      "陪你过完一年四季",
      "爱死你了",
      "让我爱你疼你",
      "照顾你陪伴你",
      "给你买好吃的，做好吃的",
      "晚上给你按摩",
      "洗完头发给你吹头发",
      "天天疼着你",
      "不离不弃",
      "一直相随",
      "我已经习惯你了爱你了",
      "你不能离开我",
      "我晚上带爱心汤哦",
      "宝贝，喝点水，吃果果，走动一下",
      "嗯嗯，听老婆的",
      "你快去午休啦",
      "知道啦",
      "去吃饭饭罗",
      "嗯嗯，出门注意安全",
      "谢谢亲爱的",
      "嘻嘻",
      "不辛苦，好开心幸福",
      "宝贝，累不累，在你身边就好了，给你按摩",
      "谢谢你哟",
      "我也会对你好好的",
      "对啊",
      "好滴",
      "今天好开心哟",
      "帅帅的你",
      "珍珍老师",
      "我等你宝贝", 
      "好想你",
      "我等你哦，不急不急"
    ]);
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
