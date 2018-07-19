import {FishState,FishType} from "./FishType";
import Fish from "./Fish";
import Bullet from "./Bullet";
import Net from "./Net";
import CoinsControls from "./CoinsControls";
import Weapon from "./Weapon";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    fishPrefab:cc.Prefab=null;

    @property(cc.Node)
    weaponNode:cc.Node=null;

    @property(cc.Prefab)
    bulletPrefab:cc.Prefab=null;

    @property(cc.Prefab)
    netPrefab:cc.Prefab=null;

    @property(cc.Node)
    coinsControls:cc.Node=null;

    @property(cc.SpriteAtlas)
    spAtlas:cc.SpriteAtlas=null;

    @property(cc.Node)
    gameoverNode:cc.Node=null;

    @property(cc.AudioClip)
    private bgm:cc.AudioClip=null;
    
    @property(cc.AudioClip)
    private bgmWater:cc.AudioClip=null;

    oneFish:cc.Node;
    oneBullet:cc.Node;
    oneNet:cc.Node;
    fishPool:cc.NodePool;
    fishTypes:FishType[];
    bulletPool:cc.NodePool;
    netPool:cc.NodePool;
    
    onLoad(){
        cc.director.getCollisionManager().enabled=true;//开启碰撞系统
        cc.audioEngine.play(this.bgm as any,true,1);//播放背景音乐
        cc.audioEngine.play(this.bgmWater as any,true,1);
        this.bulletPool=new cc.NodePool(Bullet);
        this.fishPool=new cc.NodePool(Fish);
        this.netPool=new cc.NodePool(Net);
        let fishCount=10;
        for(let i=0;i<fishCount;i++){
            let fishPre=cc.instantiate(this.fishPrefab);
            this.fishPool.put(fishPre);
        }
        cc.find("Canvas/bg").setLocalZOrder(-1);//setLocalZOrder:设置z轴层级
        cc.find("Canvas/btmBar").setLocalZOrder(1);
        this.gameoverNode.setLocalZOrder(2);
        this.gameoverNode.active=false;
        this.coinsControls.getComponent(CoinsControls).init();
        this.weaponNode.getComponent(Weapon).init();
        let self=this;
        //在屏幕上显示FPS数，开发阶段建议开启这个设置，可以通过这个对自己游戏性能有个大体了解，等游戏正式发布可关闭这个设置
        cc.director.setDisplayStats(true);
        //动态加载json配置文件
        cc.loader.loadRes("FishConfig",function(err,data){
            if(err){
                cc.error(err.message || err);
                return;
            }
            //加载之后转类型
            self.fishTypes=<FishType[]>data;
            self.schedule(self.createFish,2);//每隔2秒执行一次self.createFish方法
        });
        //添加触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START,function(event:cc.Event.EventTouch){
            //需要将触点坐标转换成局部坐标，跟炮台一致（为什么？这样才能保证子弹从炮台以上位置射出，否则就会从屏幕底部射出）
            let touchPos=self.weaponNode.parent.convertTouchToNodeSpaceAR(event.touch);
            let weaponPos=self.weaponNode.getPosition();
            if(touchPos.y<weaponPos.y) return;
            let radian=Math.atan((touchPos.x-weaponPos.x)/(touchPos.y-weaponPos.y));
            let degree=radian*180/3.14;
            self.weaponNode.rotation=degree;
            let BulletLevel=self.weaponNode.getComponent(Weapon).curLevel;
            self.shot(BulletLevel);
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            return;
        },this);
        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            return;
        },this);
    }
    //开炮
    shot(lev:number){
        if(this.bulletPool.size()>0){
            this.oneBullet=this.bulletPool.get(this);
        }else{
            this.oneBullet=cc.instantiate(this.bulletPrefab);
        }
        //是否剩余金币
        let left=this.coinsControls.getComponent(CoinsControls).reduceCoin(lev);
        if(left){
            this.oneBullet.getComponent(Bullet).shot(this,lev);
        }else{
            if(this.coinsControls.getComponent(CoinsControls).currnetValue==0){
                this.gameOver();
                cc.audioEngine.stopAll();
            }
        }
    }
    createFish(){
        let fishcount=3;
        for(let i=0;i<fishcount;i++){
            let cfish:cc.Node=null;
            if(this.fishPool.size()>0){
                cfish=this.fishPool.get(this);
            }else{
                cfish=cc.instantiate(this.fishPrefab);
            }
            cfish.getComponent(Fish).init(this);
        }
    }
    castNet(pos:cc.Vec2){
        if(this.netPool.size()>0){
            this.oneNet=this.netPool.get(this);
        }else{
            this.oneNet=cc.instantiate(this.netPrefab);
        }
        let bulletLever=this.weaponNode.getComponent(Weapon).curLevel;
        this.oneNet.getComponent(Net).init(pos,this,bulletLever);
    }
    despawnFish(fish:cc.Node){
        this.fishPool.put(fish);
    }
    despawnBullet(bullet:cc.Node){
        this.bulletPool.put(bullet);
    }
    despawnNet(net:cc.Node){
        this.netPool.put(net);
    }
    gainCoins(coinPos:cc.Vec2,value:number){
        this.coinsControls.getComponent(CoinsControls).gainCoins(coinPos,value);
    }
    gameOver(){
        this.gameoverNode.active=true;
        this.unscheduleAllCallbacks();//停止所有计时器
    }
    gameReStart(){
        cc.director.loadScene("fishmain");
        cc.audioEngine.play(this.bgm as any,true,1);//播放背景音乐
        cc.audioEngine.play(this.bgmWater as any,true,1);
    }
}
