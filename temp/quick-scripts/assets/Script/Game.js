(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e0e243AQyFAnaMaBneifGAj', 'Game', __filename);
// Script/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Fish_1 = require("./Fish");
var Bullet_1 = require("./Bullet");
var Net_1 = require("./Net");
var CoinsControls_1 = require("./CoinsControls");
var Weapon_1 = require("./Weapon");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fishPrefab = null;
        _this.weaponNode = null;
        _this.bulletPrefab = null;
        _this.netPrefab = null;
        _this.coinsControls = null;
        _this.spAtlas = null;
        _this.gameoverNode = null;
        _this.bgm = null;
        _this.bgmWater = null;
        return _this;
    }
    Game.prototype.onLoad = function () {
        cc.director.getCollisionManager().enabled = true; //开启碰撞系统
        cc.audioEngine.play(this.bgm, true, 1); //播放背景音乐
        cc.audioEngine.play(this.bgmWater, true, 1);
        this.bulletPool = new cc.NodePool(Bullet_1.default);
        this.fishPool = new cc.NodePool(Fish_1.default);
        this.netPool = new cc.NodePool(Net_1.default);
        var fishCount = 10;
        for (var i = 0; i < fishCount; i++) {
            var fishPre = cc.instantiate(this.fishPrefab);
            this.fishPool.put(fishPre);
        }
        cc.find("Canvas/bg").setLocalZOrder(-1); //setLocalZOrder:设置z轴层级
        cc.find("Canvas/btmBar").setLocalZOrder(1);
        this.gameoverNode.setLocalZOrder(2);
        this.gameoverNode.active = false;
        this.coinsControls.getComponent(CoinsControls_1.default).init();
        this.weaponNode.getComponent(Weapon_1.default).init();
        var self = this;
        //在屏幕上显示FPS数，开发阶段建议开启这个设置，可以通过这个对自己游戏性能有个大体了解，等游戏正式发布可关闭这个设置
        cc.director.setDisplayStats(true);
        //动态加载json配置文件
        cc.loader.loadRes("FishConfig", function (err, data) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            //加载之后转类型
            self.fishTypes = data;
            self.schedule(self.createFish, 2); //每隔2秒执行一次self.createFish方法
        });
        //添加触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            //需要将触点坐标转换成局部坐标，跟炮台一致（为什么？这样才能保证子弹从炮台以上位置射出，否则就会从屏幕底部射出）
            var touchPos = self.weaponNode.parent.convertTouchToNodeSpaceAR(event.touch);
            var weaponPos = self.weaponNode.getPosition();
            if (touchPos.y < weaponPos.y)
                return;
            var radian = Math.atan((touchPos.x - weaponPos.x) / (touchPos.y - weaponPos.y));
            var degree = radian * 180 / 3.14;
            self.weaponNode.rotation = degree;
            var BulletLevel = self.weaponNode.getComponent(Weapon_1.default).curLevel;
            self.shot(BulletLevel);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            return;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            return;
        }, this);
    };
    //开炮
    Game.prototype.shot = function (lev) {
        if (this.bulletPool.size() > 0) {
            this.oneBullet = this.bulletPool.get(this);
        }
        else {
            this.oneBullet = cc.instantiate(this.bulletPrefab);
        }
        //是否剩余金币
        var left = this.coinsControls.getComponent(CoinsControls_1.default).reduceCoin(lev);
        if (left) {
            this.oneBullet.getComponent(Bullet_1.default).shot(this, lev);
        }
        else {
            if (this.coinsControls.getComponent(CoinsControls_1.default).currnetValue == 0) {
                this.gameOver();
                cc.audioEngine.stopAll();
            }
        }
    };
    Game.prototype.createFish = function () {
        var fishcount = 3;
        for (var i = 0; i < fishcount; i++) {
            var cfish = null;
            if (this.fishPool.size() > 0) {
                cfish = this.fishPool.get(this);
            }
            else {
                cfish = cc.instantiate(this.fishPrefab);
            }
            cfish.getComponent(Fish_1.default).init(this);
        }
    };
    Game.prototype.castNet = function (pos) {
        if (this.netPool.size() > 0) {
            this.oneNet = this.netPool.get(this);
        }
        else {
            this.oneNet = cc.instantiate(this.netPrefab);
        }
        var bulletLever = this.weaponNode.getComponent(Weapon_1.default).curLevel;
        this.oneNet.getComponent(Net_1.default).init(pos, this, bulletLever);
    };
    Game.prototype.despawnFish = function (fish) {
        this.fishPool.put(fish);
    };
    Game.prototype.despawnBullet = function (bullet) {
        this.bulletPool.put(bullet);
    };
    Game.prototype.despawnNet = function (net) {
        this.netPool.put(net);
    };
    Game.prototype.gainCoins = function (coinPos, value) {
        this.coinsControls.getComponent(CoinsControls_1.default).gainCoins(coinPos, value);
    };
    Game.prototype.gameOver = function () {
        this.gameoverNode.active = true;
        this.unscheduleAllCallbacks(); //停止所有计时器
    };
    Game.prototype.gameReStart = function () {
        cc.director.loadScene("fishmain");
        cc.audioEngine.play(this.bgm, true, 1); //播放背景音乐
        cc.audioEngine.play(this.bgmWater, true, 1);
    };
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "fishPrefab", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "weaponNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "bulletPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "netPrefab", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "coinsControls", void 0);
    __decorate([
        property(cc.SpriteAtlas)
    ], Game.prototype, "spAtlas", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "gameoverNode", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "bgm", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "bgmWater", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        