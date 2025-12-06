/*:
 * @target MZ
 * @plugindesc Completely disable levels and hide them everywhere (safe)
 * @author ChatGPT
 * @help
 * - Characters do not gain EXP or level up.
 * - Levels are hidden everywhere without breaking menu animations.
 */

(() => {

    // === Заблокировать EXP и уровень ===
    Game_Actor.prototype.gainExp = function(exp) { return; };
    Game_Actor.prototype.levelUp = function() { return; };
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._level = 1;
        this._exp[this._classId] = 0;
    };

    // === Подменяем метод получения уровня ===
    Object.defineProperty(Game_Actor.prototype, 'level', {
        get: function() { return 1; }, // фиксированный уровень
        configurable: true
    });

    // === Скрываем уровень в статусе и меню ===
    Window_Base.prototype.drawActorLevel = function(actor, x, y) {
        // пусто, ничего не рисуем
    };

    // === Скрываем уровень в меню персонажей ===
    const _Window_MenuStatus_drawItem = Window_MenuStatus.prototype.drawItem;
    Window_MenuStatus.prototype.drawItem = function(index) {
        const actor = $gameParty.members()[index];
        if (!actor) return;
        const rect = this.itemRect(index);
        const lineHeight = this.lineHeight();
        // рисуем только имя, HP, MP, TP
        this.drawActorName(actor, rect.x, rect.y, rect.width);
        this.drawActorHp(actor, rect.x, rect.y + lineHeight, rect.width);
        this.drawActorMp(actor, rect.x, rect.y + lineHeight * 2, rect.width);
    };

    // === Скрываем уровень в боевом статусе ===
    const _Window_BattleStatus_drawActorSimpleStatus = Window_BattleStatus.prototype.drawActorSimpleStatus;
    Window_BattleStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        width = width || 186;
        const lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y, width);
        this.drawActorHp(actor, x, y + lineHeight, width);
        this.drawActorMp(actor, x, y + lineHeight * 2, width);
        this.drawActorTp(actor, x, y + lineHeight * 3, width);
    };

})();
