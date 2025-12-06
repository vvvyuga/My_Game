/*:
 * @target MZ
 * @plugindesc Clean Minimal Title Menu (SAFE - no windows, no scroll, text only, exit)
 * @author ChatGPT
 */

(() => {

const FONT_SIZE = 28;
const COMMANDS = ["New Game", "Continue", "Options", "Exit"];

class Window_MinimalTitle extends Window_Base {
    initialize() {
        const rect = new Rectangle(0, 0, Graphics.width, Graphics.height);
        super.initialize(rect);
        this.opacity = 0;
        this._index = 0;
        this.contents.fontSize = FONT_SIZE;
        this.refresh();
    }

    update() {
        super.update();

        if (Input.isRepeated("down")) {
            this._index = (this._index + 1) % COMMANDS.length;
            this.refresh();
        }

        if (Input.isRepeated("up")) {
            this._index = (this._index + COMMANDS.length - 1) % COMMANDS.length;
            this.refresh();
        }

        if (Input.isTriggered("ok")) {
            this.processOk();
        }
    }

    processOk() {
        const cmd = COMMANDS[this._index];
        const scene = SceneManager._scene;

        if (cmd === "New Game") scene.commandNewGame();
        if (cmd === "Continue") scene.commandContinue();
        if (cmd === "Options") scene.commandOptions();
        if (cmd === "Exit") {
            if (Utils.isNwjs()) require("nw.gui").App.quit();
            else SceneManager.exit();
        }
    }

    refresh() {
        this.contents.clear();
        const lh = this.lineHeight();
        const startY = Graphics.height / 2 - (COMMANDS.length * lh) / 2;

        for (let i = 0; i < COMMANDS.length; i++) {
            const y = startY + i * lh;
            const color = i === this._index ? "#ffffff" : "#aaaaaa";
            this.changeTextColor(color);
            this.drawText(COMMANDS[i], 0, y, Graphics.width, "center");
        }
    }
}


// ✅ ПРАВИЛЬНО: НЕ УДАЛЯЕМ стандартное окно, а скрываем его
const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _Scene_Title_createCommandWindow.call(this);

    // Стандартное окно нужно движку → просто прячем
    this._commandWindow.opacity = 0;
    this._commandWindow.visible = false;
    this._commandWindow.deactivate();

    // Наш минималистичный текст
    this._minimalTitleWindow = new Window_MinimalTitle();
    this.addWindow(this._minimalTitleWindow);
};

})();
