;(function(win, doc) {

    /**
     * @param Object
     * @element 元素的名称
     * @attributes 被转换的元素属性
     * @dataAttributes 转换的属性
     * @offsetTop 显示的垂直距离
     * @offsetLeft 显示的水平距离
     * @duraction 固定的毫秒内必触发
     * @delay 事件不动的时候触发
     * @ele 默认事件为滚动事件
     * @author slim。
     * @date 2017.07.10
     */
    var lazyLoadPlugin = function(Object) {

        /*设置默认属性*/
        this.defaults = {
            element: Object.element || "img",
            attributes: Object.attributes || "src",
            dataAttributes: Object.dataAttributes || "data-src",
            offsetTop: Object.offsetTop || 0,
            // offsetLeft: Object.offsetLeft || 0,
            duraction: Object.duraction || 800,
            delay: Object.delay || 500,
            ele: Object.ele || "scroll"
        }
    }

    lazyLoadPlugin.prototype = {
        constructor: lazyLoadPlugin,
        /*获取元素*/
        getItem: function(dataAttr) {

            var item = doc.getElementsByTagName(this.defaults.element);

            //获取相应属性的元素
            var newItem = [];

            //判断是否存在属性
            for(var i = 0; i < item.length; i++) {
                if(!!item[i].getAttribute(dataAttr)) {
                    newItem[i] = item[i];
                }
            }
            return newItem;
        },
        /*事件绑定*/
        addEvent: function(ele, type, fn) {
            if(ele.addEventListener) {
                ele.addEventListener(type, fn, false);
            } else if(ele.attachEvent) {
                ele.attachEvent("on" + type, fn);
            } else {
                ele["on" + type] = fn;
            }
        },
        /*函数节流*/
        throttle: function(fn, duraction, delay) {
            var startTime = +new Date();

            return function() {
                var context = this;
                var args = arguments;
                var endTime = +new Date();

                //清除计时器
                clearInterval(this.timer);

                //判断是否超过时间
                if(endTime - startTime > duraction) {
                    fn.apply(context, args);
                    startTime = endTime;
                } else {

                    this.timer = setTimeout(function() {
                        fn.apply(context, args);
                    }, delay);
                }
            }
        },
        /*判断是否在可视区域并替换图片*/
        replacefun: function(attr, dataAttr) {

            //获取元素
            var items = this.getItem(dataAttr);

            //获取可视区域的宽度和高度
            var vWidth = window.innerWidth || document.documentElement.clientWidth;
            var vHeight = window.innerHeight || document.documentElement.clientHeight;

            //判断元素是否在可视区域内
            for(var i = 0; i < items.length; i++) {
                var tops = items[i].getBoundingClientRect().top;
                var bottoms = items[i].getBoundingClientRect().bottom;
                var lefts = items[i].getBoundingClientRect().left;
                var rights = items[i].getBoundingClientRect().right;

                // if(tops <= (vHeight + this.defaults.offsetTop) && bottoms > (0 - this.defaults.offsetTop) && rights >= (0 - this.defaults.offsetLeft) && lefts <= (vWidth + this.defaults.offsetLeft)) {
              if(tops <= (vHeight + this.defaults.offsetTop) && bottoms > (0 - this.defaults.offsetTop) || (tops === 0 && bottoms === 0 && lefts === 0 && rights === 0)) {
                    items[i][attr] = items[i].getAttribute("data-src");
                }
            }
        },
        init: function() {
            var contexts = this;

            //初始化执行一次
            setTimeout(function() {
                contexts.replacefun(contexts.defaults.attributes, contexts.defaults.dataAttributes);
            }, contexts.defaults.delay);

            //使用滚动兼容事件
            this.addEvent(window, contexts.defaults.ele, contexts.throttle(function() {
                contexts.replacefun(contexts.defaults.attributes, contexts.defaults.dataAttributes);
            }, contexts.defaults.duraction, contexts.defaults.delay));
        }
    }

    //判断是否为cmd、amd或window
    if(typeof exports == "object") {
        module.exports = lazyLoadPlugin;
    } else if(typeof define == "function" && define.amd) {
        define([], function() {
            return  lazyLoadPlugin;
        });
    } else {
        win.lazyLoadPlugin = lazyLoadPlugin;
    }
})(window, document);
