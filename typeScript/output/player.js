var Player = /** @class */ (function () {
    function Player(name, age, country) {
        this.name = name;
        this.age = age;
        this.country = country;
    }
    Player.prototype.play = function () {
        console.log("".concat(this.name, " is ").concat(this.country, " and ").concat(this.age));
    };
    return Player;
}());
export { Player };
//# sourceMappingURL=player.js.map