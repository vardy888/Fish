//定义一个接口，用来对应json配置文件转成对象
interface FishType{
    name:string;//名称
    hp:number;//血量
    gold:number;//掉落金币数量
}
//鱼的声明状态
enum FishState{
    alive,
    dead
}
export{FishState,FishType}