/*:
 * @target MZ
 * @plugindesc Добавляет кнопку Quit на титульный экран (Scene_Title)
 * @author Pavel
 */

(() => {

    // Сохраняем оригинальный метод формирования списка команд
    const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("Quit", "quit");
    };

    // Сохраняем оригинальный метод создания командного окна на титульном экране
    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);

        // Назначаем обработчик новой команды
        this._commandWindow.setHandler("quit", this.commandQuit.bind(this));
    };

    // Метод выхода из игры
    Scene_Title.prototype.commandQuit = function() {
        const result = confirm("Are you sure you want to quit?");
        if(result) {
            SceneManager.exit();
        }
    };

})();

