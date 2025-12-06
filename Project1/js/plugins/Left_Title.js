/*:
 * @target MZ
 * @plugindesc Main menu: text left-aligned, buttons hidden
 * @help
 * Aligns all main menu commands to the left and hides the button backgrounds.
 */

(() => {

    // === Скроем фон кнопок ===
    const _Window_Command_drawItemBackground = Window_Command.prototype.drawItemBackground;
    Window_Command.prototype.drawItemBackground = function(index) {
        // пусто — фон кнопок не рисуется
        // hover подсветка всё ещё работает
    };

    // === Выровнять текст команд по левому краю ===
    const _Window_Command_drawItem = Window_Command.prototype.drawItem;
    Window_Command.prototype.drawItem = function(index) {
        const rect = this.itemRect(index); // безопасный метод
        if (rect) {
            const alignBackup = this.contents.textAlign;
            this.contents.textAlign = 'left'; // текст по левому краю
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width);
            this.contents.textAlign = alignBackup;
        }
    };

})();
