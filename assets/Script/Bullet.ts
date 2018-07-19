import Game from "./Game";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    angle:number=0;//子弹初始角度
    game:Game;
    private attack:number=3;//子弹攻击力

    @property
    speed:number=10;
    
    bulletLevel:number=1;//子弹等级

    shot(game:Game,level:number){
        this.game=game;
        this.enabled=true;//启动update函数
        let weaponSite=game.weaponNode.parent.convertToWorldSpaceAR(game.weaponNode.getPosition());//将game.weaponNode的坐标转换为相对于世界坐标系下的game.weaponNode.parent锚点的坐标
        this.angle=game.weaponNode.rotation;
        this.node.rotation=this.angle;
        let bpos=cc.p(weaponSite.x+50*Math.sin(this.angle/180*3.14),weaponSite.y+50*Math.cos(this.angle/180*3.14));
        this.setBullet(level);
        this.node.position=bpos;
        this.node.parent=cc.director.getScene();//场景节点
    }
    //根据武器等级设置子弹等级
    setBullet(lev:number){
        this.bulletLevel=lev;
        this.node.getComponent(cc.Sprite).spriteFrame=this.game.spAtlas.getSpriteFrame("bullet"+lev);
    }
    update(dt){
        let bx=this.node.x;
        let by=this.node.y;
        bx+=dt*this.speed*Math.sin(this.angle/180*3.14);
        by+=dt*this.speed*Math.cos(this.angle/180*3.14);
        this.node.x=bx;
        this.node.y=by;
        if(this.node.x>cc.director.getWinSize().width+100
        || this.node.x<-100
        || this.node.y>cc.director.getWinSize().height+100
        || this.node.y<0
        ){
            this.game.despawnBullet(this.node);
        }
    }
    //碰撞产生时
    onCollisionEnter(other,self){
        let posb=self.world.points;//矩形碰撞组件顶点坐标，左上左下右下右上
        let posNet=cc.pMidpoint(posb[0],posb[3]);//取左上和右上坐标计算中点当做碰撞中点
       // console.log(this.game);
        this.game.castNet(posNet);
        this.game.despawnBullet(this.node);
    }
    getAttackValue():number{
        return this.attack*this.bulletLevel;
    }
}
