/*:
 * @target MZ
 * @plugindesc Completely disable level system and hide levels everywhere
 * @author ChatGPT
 * @help
 * - Characters do not gain EXP or level up.
 * - Levels are hidden in menus, status windows, and battle.
 */

(() => {

    // === Отключаем опыт и повышение уровня ===
    Game_Actor.prototype.gainExp = function(exp) {
        return; // не даём опыт
    };

    Game_Actor.prototype.levelUp = function() {
        return; // не повышаем уровень
    };

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._level = 1; // фиксированный уровень
        this._exp[this._classId] = 0;
    };

    // === Скрываем уровень в статусе и меню ===
    Window_Base.prototype.drawActorLevel = function(actor, x, y) {
        // ничего не рисуем
        return;
    };

    // === Скрываем уровень в окне выбора персонажа в бою ===
    Window_BattleStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        width = width || 186;
        const lineHeight = this.lineHeight();
        const x2 = x + width;
        const y2 = y + lineHeight * 0;
        const w = width;

        // рисуем только имя и HP/MP/TP
        this.drawActorName(actor, x, y, width);
        this.drawActorHp(actor, x, y + lineHeight, width);
        this.drawActorMp(actor, x, y + lineHeight * 2, width);
        this.drawActorTp(actor, x, y + lineHeight * 3, width);
    };

})();
