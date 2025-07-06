"use strict";
var player = /** @class */ (function () {
    function player(n, a, c) {
        this.name = n;
        this.age = a;
        this.country = c;
    }
    player.prototype.play = function () {
        console.log("".concat(this.name, " is playing.His age is ").concat(this.age, " and he is from ").concat(this.country));
    };
    return player;
}());
var mashrafi = new player("Mashrafi", 40, "Bangladesh");
mashrafi.play();
