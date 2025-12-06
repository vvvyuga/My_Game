/*:
 * @target MZ
 * @plugindesc Minimalist Black Windows - Все окна диалогов и меню просто черные плашки
 * @author ChatGPT
 *
 * @help Все окна будут полностью черными, без градиентов и рамок.
 */

(() => {

    // Переписываем метод создания фонового спрайта окна
    const _Window_createBackground = Window.prototype._createBackground;
    Window.prototype._createBackground = function() {
        _Window_createBackground.call(this);
        if (this._windowSpriteContainer && this._windowSpriteContainer.children[0]) {
            // делаем спрайт полностью чёрным
            this._windowSpriteContainer.children[0].bitmap.fillAll('#000000');
        }
    };

    // Отключаем рисование стандартного фона (градиентов)
    const _Window_Base_drawBackground = Window_Base.prototype.drawBackground;
    Window_Base.prototype.drawBackground = function() {
        // ничего не рисуем, фон уже чёрный
    };

})();

