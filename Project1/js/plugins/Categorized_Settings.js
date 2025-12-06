/*:
 * @target MZ
 * @plugindesc Sectioned Options Menu (Left Categories, Right Options, Top Description)
 * @author ChatGPT
 *
 * @help
 * Replaces default Options menu with:
 * - Top: description
 * - Left: category list
 * - Right: options
 */

(() => {

class Scene_SectionedOptions extends Scene_MenuBase {
    create() {
        super.create();
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createOptionsWindow();
    }

    createHelpWindow() {
        const rect = new Rectangle(0, 0, Graphics.boxWidth, 80);
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }

    createCategoryWindow() {
        const rect = new Rectangle(0, 80, 240, Graphics.boxHeight - 80);
        this._categoryWindow = new Window_OptionsCategory(rect);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    }

    createOptionsWindow() {
        const rect = new Rectangle(240, 80, Graphics.boxWidth - 240, Graphics.boxHeight - 80);
        this._optionsWindow = new Window_SectionedOptions(rect);
        this._optionsWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._optionsWindow);
        this._categoryWindow.setOptionsWindow(this._optionsWindow);
    }

    onCategoryOk() {
        const category = this._categoryWindow.currentSymbol();
        this._optionsWindow.setCategory(category);
        this._optionsWindow.activate();
    }
}

// -----------------------------
// CATEGORY WINDOW (LEFT PANEL)
// -----------------------------

class Window_OptionsCategory extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this._data = [
            { name: "Graphics", symbol: "graphics" },
            { name: "Sound", symbol: "sound" },
            { name: "Gameplay", symbol: "gameplay" }
        ];
        this.refresh();
        this.select(0);
    }

    maxItems() {
        return this._data.length;
    }

    drawItem(index) {
        const rect = this.itemRectForText(index);
        this.drawText(this._data[index].name, rect.x, rect.y, rect.width);
    }

    currentSymbol() {
        return this._data[this.index()].symbol;
    }

    setOptionsWindow(win) {
        this._optionsWindow = win;
    }
}

// -----------------------------
// OPTIONS WINDOW (RIGHT PANEL)
// -----------------------------

class Window_SectionedOptions extends Window_Options {

    constructor(rect) {
        super(rect);
        this._category = "graphics";
        this.makeCommandList();
    }

    setCategory(category) {
        this._category = category;
        this.refresh();
        this.select(0);
    }

    makeCommandList() {
        this.clearCommandList();

        if (this._category === "graphics") {
            this.addCommand("Fullscreen", "fullscreen");
            this.addCommand("Show FPS", "fpsCounter");
        }

        if (this._category === "sound") {
            this.addCommand("BGM Volume", "bgmVolume");
            this.addCommand("BGS Volume", "bgsVolume");
            this.addCommand("ME Volume", "meVolume");
            this.addCommand("SE Volume", "seVolume");
        }

        if (this._category === "gameplay") {
            this.addCommand("Always Dash", "alwaysDash");
            this.addCommand("Command Remember", "commandRemember");
        }
    }

    updateHelp() {
        if (!this._helpWindow) return;

        const map = {
            fullscreen: "Toggles fullscreen mode.",
            fpsCounter: "Shows FPS counter.",
            bgmVolume: "Music volume.",
            bgsVolume: "Background sound volume.",
            meVolume: "Music effects volume.",
            seVolume: "Sound effects volume.",
            alwaysDash: "Always run instead of walk.",
            commandRemember: "Remembers last selected command."
        };

        const text = map[this.currentSymbol()] || "";
        this._helpWindow.setText(text);
    }
}

// -----------------------------
// REPLACE DEFAULT OPTIONS MENU
// -----------------------------

const _Scene_Menu_commandOptions = Scene_Menu.prototype.commandOptions;
Scene_Menu.prototype.commandOptions = function() {
    SceneManager.push(Scene_SectionedOptions);
};

})();
