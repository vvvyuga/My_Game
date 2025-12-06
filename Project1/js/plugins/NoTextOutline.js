/*:
 * @target MZ
 * @plugindesc Убирает черную обводку текста у всех окон
 * @author Pavel
 */

(() => {
    const _resetFontSettings = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _resetFontSettings.call(this);
        this.contents.outlineWidth = 0; // убирает обводку
    };
})();
