(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/CoinsControls.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6569cF6oL9HN4K8tQKUGQuC', 'CoinsControls', __filename);
// Script/CoinsControls.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Coins_1 = require("./Coins");
var NumUp_1 = require("./NumUp");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CoinsControls = /** @class */ (function (_super) {
    __extends(CoinsControls, _super);
    function CoinsControls() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.coinPlusPrefab = null;
        _this.coinsPrefab = null;
        _this.number1 = null;
        _this.number2 = null;
        _this.number3 = null;
        _this.number4 = null;
        _this.number5 = null;
        _this.number6 = null;
        _this.timerAtlas = null;
        _this.currnetValue = 0;
        _this.toValue = 0;
        return _this;
    }
    CoinsControls.prototype.init = function () {
        this.coinUpPool = new cc.NodePool();
        this.coinsPool = new cc.NodePool();
        this.setValue(this.currnetValue);
    };
    //功能函数：数字固定长度length,不够的补0
    CoinsControls.prototype.prefixInteger = function (num, length) {
        return (Array(length).join('0') + num).slice(-length);
    };
    CoinsControls.prototype.setValue = function (val) {
        var str = this.prefixInteger(val, 6);
        var nums = str.split('');
        this.number1.spriteFrame = this.timerAtlas.getSpriteFrame(nums[0].toString());
        this.number2.spriteFrame = this.timerAtlas.getSpriteFrame(nums[1].toString());
        this.number3.spriteFrame = this.timerAtlas.getSpriteFrame(nums[2].toString());
        this.number4.spriteFrame = this.timerAtlas.getSpriteFrame(nums[3].toString());
        this.number5.spriteFrame = this.timerAtlas.getSpriteFrame(nums[4].toString());
        this.number6.spriteFrame = this.timerAtlas.getSpriteFrame(nums[5].toString());
    };
    //获取金币加数
    CoinsControls.prototype.addCoins = function (val) {
        this.currnetValue += val;
        this.setValue(this.currnetValue);
    };
    //发射子弹消耗金币
    CoinsControls.prototype.reduceCoin = function (val) {
        if (this.currnetValue >= val) {
            this.setValue(this.currnetValue -= val);
            return true;
        }
        return false;
    };
    //加金币
    CoinsControls.prototype.gainCoins = function (coinPos, coinnum) {
        //上升消失动画的数字对象池
        if (this.coinUpPool.size() > 0) {
            this.coinUp = this.coinUpPool.get();
        }
        else {
            this.coinUp = cc.instantiate(this.coinPlusPrefab);
        }
        this.coinUp.getComponent(NumUp_1.default).init(coinPos, coinnum, this);
        //掉落的金币对象池
        if (this.coinsPool.size() > 0) {
            this.oneCoin = this.coinsPool.get();
            //this.oneCoin=cc.instantiate(this.coinsPrefab);
        }
        else {
            this.oneCoin = cc.instantiate(this.coinsPrefab);
        }
        console.log(this.coinsPool.size());
        this.oneCoin.getComponent(Coins_1.default).init(this);
        //将掉落的金币坐标转为世界坐标
        var toPos = this.node.convertToWorldSpaceAR(this.number3.node.position); //
        this.oneCoin.getComponent(Coins_1.default).goDown(coinPos, toPos);
        this.addCoins(coinnum);
    };
    CoinsControls.prototype.despawnCoins = function (coin) {
        this.coinsPool.put(coin);
    };
    CoinsControls.prototype.despawnCoinup = function (nup) {
        this.coinUpPool.put(nup);
    };
    __decorate([
        property(cc.Prefab)
    ], CoinsControls.prototype, "coinPlusPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], CoinsControls.prototype, "coinsPrefab", void 0);
    __decorate([
        property(cc.Sprite)
    ], CoinsControls.prototype, "number1", void 0);
    __decorate([
        property(cc.Sprite)
    ], CoinsControls.prototype, "number2", void 0);
    __decorate([
        property(cc.Sprite)
    ], CoinsControls.prototype, "number3", void 0);
    __decorate([
        property(cc.Sprite)
    ], CoinsControls.prototype, "number4", void 0);
    __decorate([
        property(cc.Sprite)
    ], CoinsControls.prototype, "number5", void 0);
    __decorate([
        property(cc.Sprite)
    ], CoinsControls.prototype, "number6", void 0);
    __decorate([
        property(cc.SpriteAtlas)
    ], CoinsControls.prototype, "timerAtlas", void 0);
    __decorate([
        property
    ], CoinsControls.prototype, "currnetValue", void 0);
    __decorate([
        property
    ], CoinsControls.prototype, "toValue", void 0);
    CoinsControls = __decorate([
        ccclass
    ], CoinsControls);
    return CoinsControls;
}(cc.Component));
exports.default = CoinsControls;

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
        //# sourceMappingURL=CoinsControls.js.map
        