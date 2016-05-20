var shareInfo={
    title:'你有一张来自秘密妆园的贺卡，请查收~ ',
    link:routePath+basePath,
    imgUrl:basePath+"/img/wx_share.jpg",
    desc:'这是我亲自为你手绘的新年贺卡哦，还不打开看看！'
}
var jssdkURL=basePath+"/wechat/jssdksign?url="+encodeURIComponent(window.location.href.split("#")[0]);

function xhrRequest(){
    var xmlHttp=null;
    try{
        xmlHttp=new XMLHttpRequest();
    }
    catch(e){
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}

function init_wx_jsapi(url,cb){
    var xhr=xhrRequest();
    xhr.open("GET",jssdkURL,false);
    xhr.onreadystatechange=function(){
        if(xhr.status == 200&&xhr.readyState == 4 ){
            var result=xhr.responseText;
                var o={};
                o.jsApiList=[
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ];
                try{
                    for (p in r=JSON.parse(result)) {
                        o[p] = r[p];
                    }
                }catch(e){

                }
                if(typeof cb==="function"){
                    cb(o)
                }
        }
    }
    xhr.send(null);
}

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
