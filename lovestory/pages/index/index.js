const app = getApp();
// 桃心型线的参数方程：
// x = 16 （sinθ）^ 3
// y = 13 cosθ - 5 cos 2θ - 2 cos 3θ - cos 4θ 
function drawHeart(ctx, x, y,size) {
  ctx.save();
   //设置初始弧度，弧度增量
  var radian = 0, radian_add = Math.PI / 360;
  ctx.translate(x, y);
  ctx.scale(size,size);
  ctx.beginPath();
  var start = getPoint(radian);
  ctx.moveTo(start[0], start[1]); //移动绘图游标至原点
  while (radian <= (Math.PI * 2)) {  //每增加一次弧度，绘制一条线
    radian += radian_add;
    var p = getPoint(radian);
    ctx.lineTo(p[0], p[1]);
  }
  ctx.setStrokeStyle("red");
  ctx.stroke();  //对路径描边
  ctx.draw();
  ctx.restore();
}
function getPoint(t) {  //获取心型线的X坐标
  return [16 * (Math.sin(t)) * (Math.sin(t)) * (Math.sin(t)), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 *t))];
}
var size=4;
var ctx ;
 function draw(){
   drawHeart(ctx, 175, 60,size); 
  //  drawHeart(ctx, 230, 60, size); 
   size +=0.1;
   if(size>4.3){
     size = 4;
   }
 }
 var textLength=0;
function showText(){
  textLength+=1;
    this.setData({
    showText: page.data.text.slice(textLength)
  })
}
var text =
  '/**\n' +
  '* 我是一个程序员,\n' +
  '* 所以写下小程序来记录我的爱情故事 \n' +
  '*/\n'+
  'Boy i = new Boy("kevinzheng");\n' +
  'Girl u = new Girl("Juan");\n' +
  '// 2014-12-29, 我遇到你并爱上你. \n' +
  'i.love(u);\n'+
  '// 你成为了我的女朋友.\n' +
  'u.accepted();\n' +
  '// 我每天想你.\n' +
  'i.miss(u);\n' +
  'i.takeCareOf(u);\n' +
  '// 你说想娶你可不容易.\n'+
  '// 我一直等待，但是坚信你会嫁给我.\n' +
  'boolean isHesitate = true;\n' +
  'while (isHesitate) {\n' +
  'i.waitFor(u);\n' +
  '// 我觉得这是一个重要的决定\n'+
  'isHesitate = u.thinkOver();\n' +
  '}\n' +
  '// :) \n' +
  'i.marry(u);\n' +
  'i.liveHappilyWith(u);';
var page =Page({
  data: {
    text: text,
    showText:"",
    loopIdx:0
  },
  onShow:function(){
    wx.playBackgroundAudio({
      dataUrl: 'http://other.web.ra01.sycdn.kuwo.cn/resource/n2/128/41/7/3555327135.mp3',
      title: 'i love you',
      coverImgUrl: 'http://img3.kuwo.cn/star/starheads/120/2/d367470c5e98b9896fb3b4a1ab3e969_0.jpg'
    });
    setInterval(function () {
      if (this.data.loopIdx <= this.data.text.length) {
        var text = this.data.text.slice(0, this.data.loopIdx)+"_"
         this.setData({
           showText: text,
          loopIdx: this.data.loopIdx + 1
        });
      }
    }.bind(this), 150);

  },
  onReady: function() {
    ctx = wx.createCanvasContext('firstCanvas');
    setInterval(draw, 400);
  },
  onShareAppMessage: function (res) {
    return {
      title: '我们的爱情故事',
      path: '/page/index'
    }
  }
})