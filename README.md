lazyLoadPlugin
===========================================

### 使用方式：
    new lazyLoadPlugin({
      element: "img",                 //元素的名称
      attributes: "src",              //被转换的元素属性
      dataAttributes: "data-src",     //转换的属性
      offsetTop: 0,                   //显示的垂直距离
      offsetLeft: 0,                  //显示的水平距离
      duraction: 800,                 //固定的毫秒内必触发
      delay: 500,                     //事件不动的时候触发
      ele: "scroll"                   //默认事件为滚动事件
    });
