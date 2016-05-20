;(function(factory){
    if(typeof define === "function" && define.amd != undefined ){
        // AMDģʽ
        define(["jquery","hammer",'hammer.fake','hammer.showtouch','megapix-image' ], factory);
    } else {
        // ȫ��ģʽ
        factory(jQuery)
    }
})(function($) {
    //2015-08-21  hammer plugin
    ;(function(){
        if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
            Hammer.plugins.showTouches();
        }
        if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
            Hammer.plugins.fakeMultitouch();
        }

        $.fn.hammer = Plugin;
        $.fn.hammer.Constructor = Myhammer;
        $.fn.hammer.noConflict=function(){
            $.fn.hammer=old;
            return this;
        }
        var old= $.fn.hammer;
        function Plugin(opt,args){
            return this.each(function(){
                var $this=$(this);
                //if($this.is("canvas")){
                    var data = $this.data("tom.hammer");
                    var opts = $.extend({},Myhammer.DEFAULTS,$this.data(),typeof opt=="object" &&opt)
                    if(!data) $this.data("tom.hammer",(data=new Myhammer(this,opts)))
                    if(typeof opt=="string") data[opt](args)
              /*  }else{
                    console.log("need a  canvas element")
                }*/
            })
        }
        Myhammer.DEFAULTS={
            transform_always_block: true,
            transform_min_scale: 1,
            drag_block_horizontal: true,
            drag_block_vertical: true,
            drag_min_distance: 0,
            gestureCb:function(){
                console.log('��������ƻص�')
            }
        }

        function Myhammer(canvas,opts){
            var posX=0, posY=0,
                lastPosX=0, lastPosY=0,
                bufferX=0, bufferY=0,
                scale=1, last_scale=1 ,rotation= 0, last_rotation, dragReady= 0,self=this,isTransform=false;
            var hammertime = Hammer(canvas, opts);
            hammertime.on('touch drag dragend transform  transformend release', function(ev) {
                if(!self.isStop){
                    manageMultitouch(ev);
                }
            });
            function manageMultitouch(ev){
                switch(ev.type) {
                    case 'touch':
                        last_scale = scale;
                        last_rotation = rotation;
                        break;
                    case 'drag':
                        if(isTransform){
                            posX = ev.gesture.deltaX + lastPosX;
                            posY = ev.gesture.deltaY + lastPosY;
                            opts.gestureCb.call(self,{x:posX,y:posY,scale:last_scale,rotate:last_rotation})
                        }
                        break;
                    case 'transform':
                        rotation = last_rotation + ev.gesture.rotation;
                        scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
                        opts.gestureCb.call(self,{x:lastPosX,y:lastPosY,scale:scale,rotate:rotation})
                        isTransform=true;
                        break;
                    case 'dragend':
                        if(isTransform){
                            lastPosX = posX;
                            lastPosY = posY;
                        }

                        break;
                    case "transformend":
                    case "dragend":
                        opts.gestureCb.call(self,{type:"release"})
                }
            }
            this.reset=function(o){
                if(o){
                    scale=last_scale= o.scale ;
                    posX= o.x;posY=o.y;
                    lastPosX=o.x;lastPosY=o.y;
                }else{
                    isTransform=false;
                    posX=0;posY=0;
                    lastPosX=0;lastPosY=0;
                    bufferX=0; bufferY=0;
                    scale=1; last_scale=1 ;rotation= 0;last_rotation=0;
                }
            }
        }
        Myhammer.prototype.stop=function(){
            this.isStop=true;
        }
        Myhammer.prototype.start=function(){
            this.isStop=false;
        }
    })();
});
