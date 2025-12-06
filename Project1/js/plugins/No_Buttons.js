/*:
 * @target MZ
 * @plugindesc Universal button background remover for all Window_Command elements, keeps hovers
 * @help
 * Removes backgrounds from all command buttons in the game,
 * preserving window frames and hover highlights.
 */

(() => {

    // Сохраняем оригинальный метод для возможности вызова при необходимости
    const _Window_Command_drawItemBackground = Window_Command.prototype.drawItemBackground;

    // Переопределяем для всех наследников Window_Command
    Window_Command.prototype.drawItemBackground = function(index) {
        // Пустая функция — фон кнопки не рисуется
        // Hover подсветка останется работать
    };

    // Универсальное выравнивание текста по левому краю для всех командных окон
    const _Window_Command_drawItem = Window_Command.prototype.drawItem;
    Window_Command.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        if (rect) {
            const alignBackup = this.contents.textAlign;
            this.contents.textAlign = 'left'; // текст по левому краю
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width);
            this.contents.textAlign = alignBackup;
        }
    };

    // Для дополнительных окон, которые используют drawItemBackground напрямую
    // Можно добавить другие наследники Window_Selectable, если нужно
    const _Window_Selectable_drawItemBackground = Window_Selectable.prototype.drawItemBackground;
    Window_Selectable.prototype.drawItemBackground = function(index) {
        // Тоже пусто, чтобы скрыть фон, но сохранить hover
    };

    // Опционально: если есть кнопки в MessageWindow
    const _Window_Message_drawItemBackground = Window_Message.prototype.drawItemBackground;
    Window_Message.prototype.drawItemBackground = function(index) {
        // Не рисуем фон кнопок
    };

})();
