import Coins from "./Coins";
import NumUp from "./NumUp";
const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinsControls extends cc.Component {
    @property(cc.Prefab)
    coinPlusPrefab:cc.Prefab=null;

    @property(cc.Prefab)
    coinsPrefab:cc.Prefab=null;

    @property(cc.Sprite)
    number1:cc.Sprite=null;

    @property(cc.Sprite)
    number2:cc.Sprite=null;

    @property(cc.Sprite)
    number3:cc.Sprite=null;

    @property(cc.Sprite)
    number4:cc.Sprite=null;

    @property(cc.Sprite)
    number5:cc.Sprite=null;

    @property(cc.Sprite)
    number6:cc.Sprite=null;

    @property(cc.SpriteAtlas)
    timerAtlas:cc.SpriteAtlas=null;

    @property
    currnetValue:number=0;

    @property
    toValue:number=0;

    coinUpPool:cc.NodePool;
    coinsPool:cc.NodePool;

    coinUp:cc.Node;//+金币数字
    oneCoin:cc.Node;//获得金币

    init(){
        this.coinUpPool=new cc.NodePool();
        this.coinsPool=new cc.NodePool();
        this.setValue(this.currnetValue);
    }

    //功能函数：数字固定长度length,不够的补0
    prefixInteger(num:number,length:number){
        return (Array(length).join('0')+num).slice(-length);
    }
    setValue(val:number){
        let str=this.prefixInteger(val,6);
        let nums=str.split('');
        this.number1.spriteFrame=this.timerAtlas.getSpriteFrame(nums[0].toString());
        this.number2.spriteFrame=this.timerAtlas.getSpriteFrame(nums[1].toString());
        this.number3.spriteFrame=this.timerAtlas.getSpriteFrame(nums[2].toString());
        this.number4.spriteFrame=this.timerAtlas.getSpriteFrame(nums[3].toString());
        this.number5.spriteFrame=this.timerAtlas.getSpriteFrame(nums[4].toString());
        this.number6.spriteFrame=this.timerAtlas.getSpriteFrame(nums[5].toString());
    }
    //获取金币加数
    addCoins(val:number){
        this.currnetValue+=val;
        this.setValue(this.currnetValue);
    }
    //发射子弹消耗金币
    reduceCoin(val:number):boolean{
        if(this.currnetValue>=val){
            this.setValue(this.currnetValue-=val);
            return true;
        }
        return false;
    }
    //加金币
    gainCoins(coinPos:cc.Vec2,coinnum:number){
        //上升消失动画的数字对象池
        if(this.coinUpPool.size()>0){
            this.coinUp=this.coinUpPool.get();
        }else{
            this.coinUp=cc.instantiate(this.coinPlusPrefab);
        }
        this.coinUp.getComponent(NumUp).init(coinPos,coinnum,this);
        //掉落的金币对象池
        if(this.coinsPool.size()>0){
             this.oneCoin=this.coinsPool.get();
            //this.oneCoin=cc.instantiate(this.coinsPrefab);
        }else{
            this.oneCoin=cc.instantiate(this.coinsPrefab);
        }
        console.log(this.coinsPool.size());
        this.oneCoin.getComponent(Coins).init(this);
        //将掉落的金币坐标转为世界坐标
        let toPos=this.node.convertToWorldSpaceAR(this.number3.node.position);//
        this.oneCoin.getComponent(Coins).goDown(coinPos,toPos)
        this.addCoins(coinnum);
    }
    despawnCoins(coin:cc.Node){
        this.coinsPool.put(coin);
    }
    despawnCoinup(nup:cc.Node){
        this.coinUpPool.put(nup);
    }   


}
