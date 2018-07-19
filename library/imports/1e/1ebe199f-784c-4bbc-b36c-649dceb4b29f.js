"use strict";
cc._RF.push(module, '1ebe1mfeExLvLNsZJ3OtLKf', 'Weapon');
// Script/Weapon.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Weapon = /** @class */ (function (_super) {
    __extends(Weapon, _super);
    function Weapon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.anim = null;
        return _this;
    }
    Weapon.prototype.init = function () {
        this.curLevel = 1;
        this.total = this.anim.getClips().length;
    };
    Weapon.prototype.toPlus = function () {
        if (this.curLevel + 1 > this.total) {
            this.curLevel = this.total;
        }
        else {
            this.curLevel++;
        }
        this.anim.play("weapon_level_" + this.curLevel);
        // console.log("加"+this.curLevel);
    };
    Weapon.prototype.toMinus = function () {
        if (this.curLevel < 2) {
            this.curLevel = 1;
        }
        else {
            this.curLevel--;
        }
        this.anim.play("weapon_level_" + this.curLevel);
        // console.log("减"+this.curLevel);
    };
    Weapon.prototype.onLoad = function () {
        this.init();
    };
    __decorate([
        property(cc.Animation)
    ], Weapon.prototype, "anim", void 0);
    Weapon = __decorate([
        ccclass
    ], Weapon);
    return Weapon;
}(cc.Component));
exports.default = Weapon;

cc._RF.pop();