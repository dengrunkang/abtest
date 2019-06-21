//blog.js
//获取应用实例
const app = getApp()
// 使用 wx.createContext 获取绘图上下文 context
var ctx = null
//坐标容器
var ctxbox = [];
//擦拭坐标容器
var ablebox = [];
// pages/kuakuaka/kuakuaka.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Jack_pots_select: [false, false, false, false, false, false, false, false, false, false, false, false],
    Jack_pots_val: ["空调", "未中奖", "洗衣机", "未中奖", "娃哈哈", "电脑", "未中奖", "手机", "未中奖", "电视机", "未中奖", "键盘"],
    is_play: false,//是否在运动中，避免重复启动bug
    available_num: 3,//可用抽奖的次数，可自定义设置或者接口返回
    start_position: 0,//转动开始时首次点亮的位置，可自定义设置
    base_circle_num: 5,//基本圈数，就是在转到（最后一圈）结束圈之前必须转够几圈 ，可自定义设置
    low_circle_num: 4,//在第几圈开始进入减速圈（必须小于等于基本圈数），可自定义设置
    use_speed: 50,//当前速度，与正常转速值相等
    nor_speed: 50,//正常转速，在减速圈之前的转速，可自定义设置
    low_speed: 120,//减速转速，在减速圈的转速，可自定义设置
    end_speed: 250,//最后转速，在结束圈的转速，可自定义设置
    random_number: 0,//中奖索引，也是随机数，也是结束圈停止的位置，这个值采用系统随机或者接口返回
    change_num: 0,//变化计数，0开始，比如实例有12个奖项，基本是6圈，那么到结束这个值=6*12+random_number；同样change_num/12整除表示走过一整圈
    canvas_isdraw: false,//画布是否在绘制中
    canvas_width: 200,//画布宽度，可自定义设置
    canvas_height: 70,//画布高度，可自定义设置
    result_arr: ["未中奖", "电视机", "洗衣机", "电冰箱"],//奖项池，可自定义设置
    canvas_clearw: 10,//橡皮咋宽，可自定义设置
    canvas_clearh: 10,//橡皮咋高，可自定义设置
    canvas_color: "#aaaaaa",//遮罩颜色，可自定义设置
    canvas_percent: 0.5,//自动提示获奖依据设置的参考比例(刮出比例占总大小多少提示)，可自定义设置(0-1)
    canvas_forPercent: false,//自动提示获奖是否已经提示，默认不提示，避免重复提示
    result_val: "未中奖",//九宫格实际奖项值
    result_val1: "未中奖",//刮刮卡实际奖项值
  },
  //重置坐标容器
  resetbox: function () {
    //坐标容器 重置
    ctxbox = [];
    //擦拭坐标容器 重置
    ablebox = [];
    //自动提示获奖是否已经提示，默认不提示，避免重复提示
    this.setData({ canvas_forPercent: false });
    //设置坐标容器 依据画布宽高按照1px分割，设置坐标，都设置为0，标识没有擦拭过
    for (var i = 0; i < this.data.canvas_width; i++) {
      ctxbox[i] = [];
      for (var j = 0; j < this.data.canvas_height; j++) {
        ctxbox[i][j] = 0;
      };
    };
    //console.log(ctxbox);
  },
  //自动提示获奖参考比例
  computerPercent: function () {
    var that = this;
    //依据擦拭坐标把擦拭过的位置和坐标容器位置重合的设置为1，标识擦拭过
    for (var i = 0; i < ablebox.length; i++) {
      for (var j = ablebox[i].ax; j <= ablebox[i].bx; j++) {
        for (var k = ablebox[i].ay; k <= ablebox[i].by; k++) {
          //坐标容器数组有范围，将溢出的设置排除
          //console.log(j,k)
          if (j >= 0 && j < this.data.canvas_width && k >= 0 && k < this.data.canvas_height) {
            ctxbox[j][k] = 1;
          }
        };
      };
    };
    //计算擦出的坐标在总坐标中的个数
    var count = 0;
    for (var i = 0; i < ctxbox.length; i++) {
      for (var j = 0; j < ctxbox[i].length; j++) {
        if (ctxbox[i][j] == 1) {
          count += 1;
        };
      };
    };
    //如果擦出的坐标在总坐标中的比例大于设置比例，提示中奖
    if (count / (this.data.canvas_width * this.data.canvas_height) > this.data.canvas_percent) {
      //console.log("ok")
      //code
      if (that.data.canvas_forPercent) {
        return false;
      }
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '你抽取的结果为，' + that.data.result_val1,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //自动提示获奖是否已经提示，默认不提示，避免重复提示
            that.setData({ canvas_forPercent: true });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      console.log("no")
    };
  },
  //产生实际奖项值
  getVal: function () {
    //生成随机参数
    var rad = Math.floor(Math.random() * this.data.result_arr.length);
    //依据随机参数设置实际奖项值
    this.setData({ result_val1: this.data.result_arr[rad] });
  },
  //初始化画布
  initCanvas: function () {
    //设置遮盖颜色
    ctx.setFillStyle(this.data.canvas_color)
    //绘制遮盖颜色
    ctx.fillRect(0, 0, this.data.canvas_width, this.data.canvas_height)
    ctx.draw();
  },
  //画布处理
  startCanvas: function (event) {
    //设置画布在绘制中
    this.setData({ canvas_isdraw: true });
  },
  moveCanvas: function (event) {
    //如果画布在绘制中
    if (this.data.canvas_isdraw) {
      //获取事件坐标
      var x = event.changedTouches[0].x;
      var y = event.changedTouches[0].y;
      //console.log(x, y)
      //橡皮擦擦出
      ctx.clearRect(x - this.data.canvas_clearw / 2, y - this.data.canvas_clearh / 2, this.data.canvas_clearw, this.data.canvas_clearh)
      //擦出坐标存储
      ablebox.push({
        ax: Math.round(x - this.data.canvas_clearw / 2),
        ay: Math.round(y - this.data.canvas_clearh / 2),
        bx: Math.round(x + this.data.canvas_clearw / 2),
        by: Math.round(y + this.data.canvas_clearh / 2)
      });
      //绘制
      ctx.draw(true)
    };
  },
  endCanvas: function (event) {
    //如果画布在绘制中
    if (this.data.canvas_isdraw) {
      //设置画布不在绘制中
      this.setData({ canvas_isdraw: false });
      //自动提示获奖依据设置的参考比例是否达到
      this.computerPercent();
    }
  },
  //重置抽奖
  reset1: function () {
    //产生实际奖项值
    this.getVal();
    //初始化画布
    this.initCanvas();
    //重置坐标容器
    this.resetbox();
    //重置九宫格抽奖次数
    var that = this;
    that.setData({ available_num: 3 });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    ctx = wx.createCanvasContext('guaguaCanvas')
    //产生实际奖项值
    this.getVal();
    //初始化画布
    this.initCanvas();
    //重置坐标容器
    this.resetbox();
  },

  //启动
  start: function () {
    var that = this;
    //是否用完可用抽奖次数
    //console.log(that.data.available_num);
    if (that.data.available_num < 1) {
      //code

      return false;
    }
    //阻止运动中重复点击
    if (!that.data.is_play) {
      //设置标识在运动中
      that.setData({ is_play: true });
      //重置参数
      that.reset();
      //生成随机奖项索引(0-that.data.Jack_pots.length)之间 || 或者后台返回这个获奖内容
      //方式1 后台
      // ajax({
      //   url,
      //   succ:function(res){
      //     // res.random来自后台的中奖索引
      //     that.setData({ random_number: res.random });
      //   }
      // })
      //方式2 随机
      that.setData({ random_number: Math.floor(Math.random() * that.data.Jack_pots_val.length) });
      //console.log(that.data.random_number);
      //运动函数
      setTimeout(that.dong, that.data.use_speed);
    };

  },
  //运动函数
  dong: function () {
    var that = this;
    //状态
    var status = [];
    for (var j = 0; j < that.data.Jack_pots_val.length; j++) {
      status[j] = false;
    };
    //重置显示
    that.setData({ Jack_pots_select: status });
    //点亮
    status[that.data.change_num % that.data.Jack_pots_val.length] = true;
    that.setData({ Jack_pots_select: status });
    //累加变化计数
    that.setData({ change_num: that.data.change_num + 1 });
    //继续运动
    if (that.data.change_num > that.data.base_circle_num * that.data.Jack_pots_val.length + that.data.random_number) {//已经到达结束位置
      //提示中奖，
      // console.log(that.data.Jack_pots_val[that.data.random_number])
      that.setData({ result_val: that.data.Jack_pots_val[that.data.random_number] })
      //code

      //运动结束设置可用抽奖的次数和激活状态设置可用
      that.endset();


    } else {//运动
      //console.log(that.data.change_num)
      if (that.data.change_num / that.data.Jack_pots_val.length + 1 < that.data.low_circle_num) {//正常转速
        //console.log("正常转速")
        that.data.use_speed = that.data.nor_speed
      } else if (that.data.change_num / that.data.Jack_pots_val.length + 1 >= that.data.low_circle_num && that.data.change_num / that.data.Jack_pots_val.length + 1 <= that.data.base_circle_num + 1) { //减速圈
        //console.log("减速圈")
        that.data.use_speed = that.data.low_speed
      } else if (that.data.change_num / that.data.Jack_pots_val.length + 1 > that.data.base_circle_num + 1) { //结束圈
        //console.log("结束圈")
        that.data.use_speed = that.data.end_speed
      }
      setTimeout(that.dong, that.data.use_speed);
    }

  },
  //运动结束设置可用抽奖的次数和激活状态设置可用
  endset: function () {
    var that = this;
    //是否在运动中，避免重复启动bug
    that.setData({ is_play: false })
    //可用抽奖的次数，可自定义设置
    that.setData({ available_num: that.data.available_num - 1 });
  },
  //重置参数
  reset: function () {
    var that = this;
    //转动开始时首次点亮的位置，可自定义设置
    that.setData({ start_position: 0 });
    //当前速度，与正常转速值相等
    that.setData({ use_speed: that.data.nor_speed });
    //中奖索引，也是随机数，也是结束圈停止的位置，这个值采用系统随机或者接口返回
    that.setData({ random_number: 0 });
    //变化计数，0开始，必须实例有12个奖项，基本是6圈，那么到结束这个值=6*12+random_number；同样change_num/12整除表示走过一整圈
    that.setData({ change_num: 0 });

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
