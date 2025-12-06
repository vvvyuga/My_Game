/*:
 * @target MZ
 * @plugindesc Character selection with 48x48 window frame portraits (pixel perfect)
 */

(() => {

const FRAME_SIZE = 48; // ровно 48x48

const characters = [
    {
        name: "Osmond",
        klass: "Scout",
        bio: "Independent scout-assassin from the Gyorna group. Kills for principles, not money. Skilled with melee weapons and tracking targets.",
        smallPortrait: "portrait1_small",
        largePortrait: "portrait1_large",
        actorId: 1
    },
    {
        name: "Patricia",
        klass: "Former Politician",
        bio: "Renegade, formerly held a high rank in Abimhore, now a fugitive half-blood. Skilled at gaining influence over others.",
        smallPortrait: "portrait2_small",
        largePortrait: "portrait2_large",
        actorId: 2
    },
    {
        name: "Devor",
        klass: "Former Miner",
        bio: "Mutant, strong in hand-to-hand combat.",
        smallPortrait: "portrait3_small",
        largePortrait: "portrait3_large",
        actorId: 3
    }
];

class Scene_CharacterSelect extends Scene_MenuBase {

    initialize() {
        super.initialize();
        this._index = 0;
    }

    create() {
        super.create();
        this.createFramedPortraits();
        this.createLargePortrait();
        this.createInfoWindow();
        this.updateSelection();
    }

    // ------------------------------------------
    // РАМКИ 48x48 + ПОРТРЕТЫ ВНУТРИ
    // ------------------------------------------

    createFramedPortraits() {
        this._frames = [];
        this._smallPortraits = [];

        const startX = 200;
        const startY = 80;
        const spacing = 56; // 48 + 8px отступ

        const windowBitmap = ImageManager.loadSystem("window");

        characters.forEach((ch, i) => {

            // --- РАМКА ИЗ WINDOW.PNG (ПРАВЫЙ ВЕРХНИЙ УГОЛ 48x48) ---
            const frame = new Sprite(new Bitmap(FRAME_SIZE, FRAME_SIZE));

            frame.bitmap.blt(
                windowBitmap,
                windowBitmap.width - FRAME_SIZE, // X — правый край
                0,                                // Y — верх
                FRAME_SIZE,
                FRAME_SIZE,
                0,
                0
            );

            frame.x = startX + spacing * i;
            frame.y = startY;
            frame.opacity = 120;

            this.addChild(frame);
            this._frames.push(frame);

            // --- ПОРТРЕТ ВНУТРИ РАМКИ (PIXEL PERFECT) ---
            const portrait = new Sprite(ImageManager.loadPicture(ch.smallPortrait));
            portrait.x = frame.x;
            portrait.y = frame.y;
            portrait.scale.x = 1;
            portrait.scale.y = 1;
            portrait.opacity = 255;

            this.addChild(portrait);
            this._smallPortraits.push(portrait);

        });
    }

    // ------------------------------------------
    // БОЛЬШОЙ БЮСТ СПРАВА
    // ------------------------------------------

    createLargePortrait() {
        this._largePortrait = new Sprite();
        this._largePortrait.x = Graphics.width - 300;
        this._largePortrait.y = 260;
        this.addChild(this._largePortrait);
    }

    // ------------------------------------------
    // ИНФО СЛЕВА
    // ------------------------------------------

    createInfoWindow() {
        const rect = new Rectangle(40, 200, 420, 320);
        this._infoWindow = new Window_Base(rect);
        this.addWindow(this._infoWindow);
    }

    // ------------------------------------------
    // УПРАВЛЕНИЕ
    // ------------------------------------------

    update() {
        super.update();

        if (Input.isRepeated("right")) this.changeIndex(1);
        if (Input.isRepeated("left")) this.changeIndex(-1);
        if (Input.isTriggered("ok")) this.selectCharacter();
        if (Input.isTriggered("escape")) SceneManager.pop();
    }

    changeIndex(delta) {
        this._index = (this._index + delta + characters.length) % characters.length;
        this.updateSelection();
    }

    // ------------------------------------------
    // ОБНОВЛЕНИЕ ВЫБОРА
    // ------------------------------------------

    updateSelection() {
        const ch = characters[this._index];

        // ПОДСВЕТКА РАМКИ
        this._frames.forEach((f, i) => {
            f.opacity = i === this._index ? 255 : 120;
        });

        // БОЛЬШОЙ БЮСТ
        this._largePortrait.bitmap = ImageManager.loadPicture(ch.largePortrait);

        // ТЕКСТ
        this._infoWindow.contents.clear();
        this._infoWindow.drawText(ch.name, 0, 0, 400);
        this._infoWindow.drawText(ch.klass, 0, 36, 400);
        this._infoWindow.drawText("——————————————", 0, 72, 400);
        this._infoWindow.drawTextEx(ch.bio, 0, 108);
    }

    // ------------------------------------------
    // ПОДТВЕРЖДЕНИЕ ВЫБОРА
    // ------------------------------------------

    selectCharacter() {
        const ch = characters[this._index];
        $gameParty._actors = [];
        $gameParty.addActor(ch.actorId);
        SceneManager.goto(Scene_Map);
    }
}

// ------------------------------------------
// ПЕРЕХВАТ NEW GAME
// ------------------------------------------

const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    _Scene_Title_commandNewGame.call(this);
    SceneManager.push(Scene_CharacterSelect);
};

})();
