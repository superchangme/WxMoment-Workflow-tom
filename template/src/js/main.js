var pageSwiper;
var $sharePage=$("#sharePage");
var $pageSwiper=$("#pageSwiper");

var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
}
if(browser.versions.android){
    $("body").addClass("android")
}
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();



init_wx_jsapi(jssdkURL,function(config){
    config.debug=false;
    wx.config(config);
    wx.ready(function(){
        saveShare();
    });
});

function saveShare(shareMess,cb){
    shareToWx(shareInfo.title,shareInfo.link,shareInfo.imgUrl,shareInfo.desc,function(){
        if(typeof cb=="function"){
            cb();
        }
        $.ajax({
            url:app.router.collectShareUrl+shareMess||"",
            complete:function(){

            }
        })
    })
}

FastClick.attach(document.body);
$(".btn").on("touchmove click",function(e){
    e.preventDefault();
})

$(function(){
    if(!scaleFactor) {
        resetMeta();
    }
});
$(".newpage").each(function(){
    var pageid=$(this).attr("id");
    if(pageid){
        app[pageid]=$(this)
    }
})
var hastouch = "ontouchstart" in window?true:false,
    tapstart = hastouch?"touchstart":"mousedown",
    tapmove = hastouch?"touchmove":"mousemove",
    tapend = hastouch?"touchend":"mouseup";

function h5Init(){
    $('body').removeClass("hidden").height(window.innerHeight);
    loadSwiper();
    $("#modalCloseBtn").on("click",function(){
        $pdModal.removeClass("in")
    })
    $(".btn-share").on("click",function(){
        $sharePage.addClass("in")
    })
    $sharePage.on("click",function(){
        $sharePage.removeClass("in")
    })
}


function loadSwiper(){
    var pageIndex=0;
    pageSwiper = new Swiper('#pagesContainer', {
        direction: 'vertical',
        observer:true,
        //onlyExternal:true, //禁用用户滑动
        mousewheelControl: true,
        onSlideChangeStart:function(swiper){
            $pageSwiper.removeClass("up")
            // $tipArrow.show();
            pageIndex=swiper.activeIndex;
        },
        onSliderMove:function(){
        }
        ,
        onInit: function (swiper) {
            swiperAnimateCache(swiper);
            swiperAnimate(swiper);
        },
        onSlideChangeEnd: function (swiper) {
        },
        onTransitionEnd: function (swiper) {
            swiperAnimate(swiper);
        },
        onReachEnd:function(){
        }
    });
    productsSwiper= new Swiper('#productsContainer', {
        direction: 'vertical',
        pagination: '.swiper-pagination',
        observer:true,
        mousewheelControl: true,
        onSlideChangeStart:function(){
            /// $tipArrow.show();
        },
        onInit: function (swiper) {
            swiperAnimateCache(swiper);
            swiperAnimate(swiper);
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper);
        },
        onTransitionEnd: function (swiper) {
        },
        onReachEnd:function(){
            setTimeout(function(){
                //   $tipArrow.hide();
            },30)
        }
    });
}

function fillNumByWord(num,word,len){return (Array(len+1).join(word)).slice(0,len-(num+'').length)+num}
function prefixEvent(t){if(t){var e=document.createElement("div"),n={Webkit:"webkit",Moz:"",O:"o"};for(var i in n)if(void 0!=e.style[i+"TransitionProperty"])return n[i]+String.fromCharCode(t[0].charCodeAt()-32)+t.slice(1)}}
function prefixStyle(style,css){
    var el = document.createElement('div')
    var vendors = 'webkitT,t,MozT,msT,OT'.split(','),svendors=[],prefix,split='-',_style=style;
    var first=style.slice(0,1);
    style=style.slice(1);
    for(var i in vendors){
        if( vendors[i].slice(-1).charCodeAt()>=97){
            svendors[i]=vendors[i].replace(/\w$/,first)
        }else{
            svendors[i]=vendors[i].replace(/\w$/,first.toUpperCase())
        }
        if(el.style[svendors[i]+style]!=undefined){
            if(css||style){
                return   split+vendors[i].slice(0,-1)+split+_style
            }else{
                return svendors[i]+style
            }
        }
    }
}
function throttle(call,delay,thisObj) {
    var  _exec,elapsed;
    function callable()
    {
        if(!_exec){
            _exec=+new Date()
            call.apply(thisObj,arguments);
        }else{
            elapsed = +new Date() - _exec;
            if( elapsed > delay ) {
                _exec = +new Date();
                call.apply(thisObj,arguments);
            }
        }
    }
    return callable;
}
function animateFrame(el, firstFrame, lastFrame, frameGapTime, isGoToFirstBoo, isLoopBoo, loopTimes, loopGapTime, callBackFun, stepFuc, waitFrame, waitTime) {
    var plugin = el.data("plugin"), frameClass,$list,
        isInit = plugin ? true : false, isPlay = plugin ? plugin.getPlayState() : false;
    if (isPlay) {
        return;
    }
    if (!isInit) {
        for (var i = 0; i <= lastFrame; i++) {
            frameClass="png-frame p" + (i + 1)+((i==0)? " show":"");
            el.append("<div class='"+frameClass+"'></div>");
        }
        $list = el.find(".png-frame");
        el.data("plugin", plugin = new Plugin());
    } else {
        plugin.reset();
        $list = plugin.list;
    }
    function Plugin() {
        var isPlay = true;
        this.list = $list;
        this.isInit = true;
        this.reset = reset;
        this.restart=function(){
            reset();
            run();
        }
        this.interval = null;
        this.timeout = null;
        this.isPlay = true;
        this.stop = function(){
            isPlay=false;
        }
        this.start = function(){
            isPlay=true;
        }
        this.getPlayState=function(){
            return isPlay
        }
    }

    function reset() {
        clearInterval(plugin.interval);
        $list.filter(function (index) {
            return index > 0
        }).removeClass("show")
        $list.eq(0).addClass("show");
        plugin.start();
        clearTimeout(plugin.timeout);
    }

    var run=function () {
        var count = firstFrame, next, time, prev;
        function frameEvent() {
            plugin.interval = setInterval(function () {
                if(!plugin.getPlayState()){
                    return;
                }
                if (waitFrame && (waitFrame == count)) {
                    if (!time) {
                        time = +new Date;
                        return;
                    } else {
                        if (+new Date - time < waitTime) {
                            return;
                        } else {
                            waitFrame = null;
                        }
                    }
                }
                prev = count;
                if (!isGoToFirstBoo) {
                    count++;
                }
                if (count == lastFrame) {
                    if (loopTimes)loopTimes--;
                    clearInterval(plugin.interval);
                    if (isLoopBoo && (loopTimes != 0 || loopTimes == null)) {
                        //循环播放 调用
                        plugin.timeout = setTimeout(function () {
                            if (isGoToFirstBoo) {
                                count = 0;
                            }
                            frameEvent();
                        }, loopGapTime);
                    }
                    if (isLoopBoo && loopTimes == 0||(!isLoopBoo)) {
                        plugin.stop();
                        if (typeof callBackFun == "function") {
                            callBackFun();
                        }
                    }
                    if (typeof callBackFun == "function" && isLoopBoo == false) {
                        callBackFun();
                    }
                }

                if (isGoToFirstBoo) {
                    count++;
                }
                if (count == lastFrame + 1) {
                    count = 0;
                }
                $list.eq(count).addClass("show");
                $list.eq(prev).removeClass("show");
                if (typeof stepFuc == "function") {
                    stepFuc(count);
                }

            }, frameGapTime);
        }
        frameEvent();
    };
    run();
    return plugin;
}
function loadAudio(src,cb){
    var audio=document.createElement("audio");
    audio.preload="preload";
    audio.autoplay="true"
    audio.src=src;
    document.body.appendChild(audio)
    $.ajax({
        url:src,
        success:function(result){
            setTimeout(function(){
                cb.call(null,audio);

            },0)
        }})
}
function animateGroup(opts){
    //group,frameClass,duration,gap,startIndex,loopTimes,cb
    var animArr=opts.group,_opts= $.extend({},opts),duration=opts.duration+(opts.gap|| 0),curEl,clsIndex,index,reset={isStop:opts.stoped,start:start};
    function initFirst(){
        if(!reset.isStop){
            curEl.addClass(opts.frameClass[clsIndex]||opts.frameClass[0])
        }
    }
    function start(){
        reset.isStop=false;
        init();
    }
    reset.stop=function(){
        clearInterval(reset.interval);
        reset.isStop=true;
        animArr.each(function(index){
            $(this).removeClass(opts.frameClass[index]||opts.frameClass[0])
        })
    }
    if(!reset.isStop){
        init();
    }
    reset.restart=function(){
        opts= $.extend({},_opts);
        start();
    }
    function init(){
        curEl=animArr.eq(0);clsIndex= 0;index=opts.startIndex|| 0;
        if(!opts.waitTime){
            go();
        }else{
            setTimeout(function(){
                go();
            },opts.waitTime)
        }
    }
    function go() {
        initFirst();
        reset.interval = setInterval(function () {
            if(reset.isStop){
                return;
            }
            if (opts.classSwitch !== false) {
                curEl.removeClass(opts.frameClass[clsIndex] || opts.frameClass[0]);
            }
            index++;
            clsIndex++;
            if (index > animArr.length - 1) {
                opts.loopTimes--;
                index = 0;
            }
            if(clsIndex>opts.frameClass.length-1){
                clsIndex=0;
            }
            curEl = animArr.eq(index);
            if (opts.loopTimes == null || opts.loopTimes != 0) {
                clearInterval(reset.interval);
                if(index==0&&opts.loopGapTime){
                    setTimeout(function(){
                        go();
                    },opts.loopGapTime);
                }else{
                    go();
                }
            }
            if (opts.loopTimes == 0) {
                clearInterval(reset.interval);
                if(opts.noWaitLast){
                    typeof opts.callback == "function" && opts.callback();
                }else{
                    setTimeout(function(){
                        typeof opts.callback == "function" && opts.callback();
                    },duration)
                }
            }
        }, duration );
    }
    return reset;
}
function playAudio(audio){
    var image=new Image;
    image.onload=function(){
        audio.play();
        audio.isPaused=false
    }
    image.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';
}
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
function shareToWx(title, link, imgUrl, desc, cb) {
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            cb();
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            cb();
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}
function johnFlashTimeLine(options){
    var animArr=options.animArr,animTime= 0,reset,plugin={},interval,timeLineArr=[],curItemIndex= 0,frameLen=animArr.length,startTime,lastTime;
     if(options.stoped){
         plugin.stoped=true;
     }
    function init(){
        plugin.interval=setInterval(function () {
            startTime=+new Date
            for(var i=0;i<animArr.length;i++){
                    animArr[i].isPlaying=false;
            }
        },animTime)
        startTime=+new Date
        timeCheck();
    }
    function timeCheck(){
        requestAnimFrame(function(){
            if(!plugin.stoped){
                lastTime=+new Date-startTime;
                for(var i=0;i<animArr.length;i++){
                    if(!animArr[i].isPlaying&&timeLineArr[i].start<=lastTime){
                        animArr[i].$item.addClass(animArr[i].frameClass);
                        animArr[i].isPlaying=true;
                        //console.log(timeLineArr[i].start,lastTime)
                    }else if(timeLineArr[i].end<=lastTime&&animArr[i].noSwitch!==true) {
                        animArr[i].$item.removeClass(animArr[i].frameClass);
                    }
                }
                timeCheck();
            }
        })
    }
    for(var i=0;i<animArr.length;i++){
        var time={start:null,end:null};
        time.start=animTime+(animArr[i].waitTime||0);
        animTime+=animArr[i].duration+(animArr[i].waitTime||0);
        time.end=animTime;
        timeLineArr.push(time);
    }
    animTime+=options.waitTime||60;
    plugin.stop=function(){
        this.stoped=true;
    }
    plugin.start=function(){
        this.stoped=false;
        if(plugin.interval){
            startTime=+new Date
            timeCheck();
        }else{
            init();
        }
    }
    plugin.restart=function(){
        plugin.stoped=false;
         window.clearInterval(this.interval);
        for(var i=0;i<animArr.length;i++){
            animArr[i].$item.removeClass(animArr[i].frameClass)
        }
        init();
    }
    if(!plugin.stoped){
        init();
    }
    return plugin
}
/*
 * ax2+bx+c
 * @param p x轴偏移
 *
 * */
function parabolaFn(a,b,c,x,p){
    return a*Math.pow(x+b/(2*a)-p,2)+c-b*b/(4*a);
}

function animateFrame2(opts) {
    var  el=opts.$frames, firstFrame=opts. firstFrame, lastFrame=opts. lastFrame, frameGapTime=opts. frameGapTime, isGoToFirstBoo=opts. isGoToFirstBoo, isLoopBoo=opts. isLoopBoo, loopTimes=opts. loopTimes, loopGapTime=opts. loopGapTime, callBackFun=opts. callBackFun, stepFuc=opts. stepFuc, waitFrame=opts. waitFrame,
        waitTime=opts. waitTime;
    var plugin = el.data("plugin"), frameClass,$list,
        isInit = plugin ? true : false, isPlay = plugin ? plugin.getPlayState() : false;
    if (isPlay) {
        return;
    }
    if (!isInit) {
        for (var i = 0; i <= lastFrame; i++) {
            frameClass="png-frame p" + (i + 1)+((i==0)? " show":"");
            el.append("<div class='"+frameClass+"'></div>");
        }
        $list = el.find(".png-frame");
        el.data("plugin", plugin = new Plugin());
    } else {
        plugin.reset();
        $list = plugin.list;
    }
    function Plugin() {
        var isPlay = true;
        this.list = $list;
        this.isInit = true;
        this.reset = reset;
        this.restart=function(){
            reset();
            run();
        }
        this.interval = null;
        this.timeout = null;
        this.isPlay = true;
        this.stop = function(){
            isPlay=false;
        }
        this.start = function(){
            isPlay=true;
        }
        this.getPlayState=function(){
            return isPlay
        }
    }

    function reset() {
        clearInterval(plugin.interval);
        $list.filter(function (index) {
            return index > 0
        }).removeClass("show")
        $list.eq(0).addClass("show");
        plugin.start();
        clearTimeout(plugin.timeout);
    }

    var run=function () {
        var count = firstFrame, next, time, prev;
        function frameEvent() {
            plugin.interval = setInterval(function () {
                if(!plugin.getPlayState()){
                    return;
                }
                if (waitFrame && (waitFrame == count)) {
                    if (!time) {
                        time = +new Date;
                        return;
                    } else {
                        if (+new Date - time < waitTime) {
                            return;
                        } else {
                            waitFrame = null;
                        }
                    }
                }
                prev = count;
                if (!isGoToFirstBoo) {
                    count++;
                }
                if (count == lastFrame) {
                    if (loopTimes)loopTimes--;
                    clearInterval(plugin.interval);
                    if (isLoopBoo && (loopTimes != 0 || loopTimes == null)) {
                        //循环播放 调用
                        plugin.timeout = setTimeout(function () {
                            if (isGoToFirstBoo) {
                                count = 0;
                            }
                            frameEvent();
                        }, loopGapTime);
                    }
                    if (isLoopBoo && loopTimes == 0||(!isLoopBoo)) {
                        plugin.stop();
                        if (typeof callBackFun == "function") {
                            callBackFun();
                        }
                    }
                    if (typeof callBackFun == "function" && isLoopBoo == false) {
                        callBackFun();
                    }
                }

                if (isGoToFirstBoo) {
                    count++;
                }
                if (count == lastFrame + 1) {
                    count = 0;
                }
                $list.eq(count).addClass("show");
                $list.eq(prev).removeClass("show");
                if (typeof stepFuc == "function") {
                    stepFuc(count);
                }

            }, frameGapTime);
        }
        frameEvent();
    };
    run();
    return plugin;
}
function showPop($popIn,$popOut,duration,effectIn,effectOut){
    duration=duration||650
    effectIn=effectIn||"fadeIn"
    effectOut=effectOut||"fadeOut"
    if($popIn){

        $popIn.removeClass(effectOut).addClass(effectIn+" active")
        setTimeout(function(){
            $popIn.addClass("in")
        },50)
    }
    if($popOut){
        $('body').addClass("pop-change")
        $popOut.removeClass(effectIn).addClass(effectOut)
        setTimeout(function(){
            if($popIn){
                $popIn.removeClass(effectIn)
            }
            $popOut.removeClass("active in "+effectOut)
            $('body').removeClass("pop-change")
        },duration+250)
    }
}
$("input,textarea").on("focus",function(){
    var self=$(this);
    setTimeout(function(){
        //$("textarea").val(document.body.getBoundingClientRect().top+"hahaha")
        if(document.body.getBoundingClientRect().top==0){
            document.body.classList.add("oninput")
        }
    },250);
}).on("blur",function(){
            document.body.classList.remove("oninput")
})
/*
window.onerror=function(err,a,b){
    alert(err)
    alert(a)
    alert(b)
}*/

//弹出框
malert.$dom=$("#alertPop");
malert.$text=malert.$dom.find(".text-box")
function malert(text,cb){
    malert.$text.text(text);
    openPage(malert.$dom)
    malert.cb=cb;
}
malert.$dom.on("click",function(){
    if(malert.cb){
        malert.cb();
        malert.cb=null;
    }
})
function openPage(page){
    page.show();
    setTimeout(function(){
        page.addClass("on")
    },100)
}
/*################h5 app code start################*/


/*################h5 app code end################*/