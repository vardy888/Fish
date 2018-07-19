import CoinsControls from "./CoinsControls";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Coins extends cc.Component {
    @property(cc.Animation)
    anim:cc.Animation=null;

    coinsControls:CoinsControls;
    init(ctr:CoinsControls){
        this.coinsControls=ctr;
        this.anim.play("goldDown");
    }
    goDown(pos:cc.Vec2,toPos:cc.Vec2){
        this.node.parent=cc.director.getScene();
        this.node.position=pos;
        let spawn=cc.spawn(cc.moveTo(0.8,toPos),cc.scaleTo(0.8,0.5));
        let cb=cc.callFunc(this.despawnCoin,this);
        let acf=cc.sequence(spawn,cb);
        this.node.runAction(acf);
    }
    despawnCoin(){
        this.coinsControls.despawnCoins(this.node);
    }
    
}
