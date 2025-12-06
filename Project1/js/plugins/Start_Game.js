/*:
 * @target MZ
 * @plugindesc Character selection screen: top portraits, left info, right bust, hover highlight from window.png
 */

(() => {
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
            this.createSmallPortraits();
            this.createLargePortrait();
            this.createInfoWindow();
            this.updateSelection();
        }

        // Горизонтальный список портретов сверху
        createSmallPortraits() {
            this._smallPortraits = [];
            this._hoverSprites = [];
            const startX = 150;
            const startY = 100;
            const spacing = 100;

            characters.forEach((ch, i) => {
                const sprite = new Sprite(ImageManager.loadPicture(ch.smallPortrait));
                sprite.x = startX + spacing * i;
                sprite.y = startY;
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                this.addChild(sprite);
                this._smallPortraits.push(sprite);

                // Ховер из window.png
                const hover = new Sprite(ImageManager.loadSystem("window"));
                hover.x = sprite.x;
                hover.y = sprite.y;
                hover.anchor.x = 0.5;
                hover.anchor.y = 0.5;
                hover.opacity = 0;
                this.addChild(hover);
                this._hoverSprites.push(hover);
            });
        }

        // Большой бюст справа
        createLargePortrait() {
            this._largePortrait = new Sprite();
            this._largePortrait.anchor.x = 0.5;
            this._largePortrait.anchor.y = 0.5;
            this._largePortrait.x = Graphics.width - 300; // справа
            this._largePortrait.y = 250;
            this.addChild(this._largePortrait);
        }

        // Информация слева
        createInfoWindow() {
            const w = 400;
            const h = 300;
            const x = 50;
            const y = 200;
            this._infoWindow = new Window_Base(new Rectangle(x, y, w, h));
            this.addChild(this._infoWindow);
        }

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

        updateSelection() {
            const ch = characters[this._index];

            // Подсветка выбранного портрета через ховер
            this._hoverSprites.forEach((hover, i) => {
                hover.opacity = i === this._index ? 128 : 0; // полупрозрачный эффект
            });

            // Обновляем большой бюст
            this._largePortrait.bitmap = ImageManager.loadPicture(ch.largePortrait);

            // Обновляем инфо
            this._infoWindow.contents.clear();
            this._infoWindow.drawText(ch.name, 0, 0, 400, "left");
            this._infoWindow.drawText(ch.klass, 0, 32, 400, "left");
            this._infoWindow.drawText("----------------------", 0, 64, 400, "left");
            this._infoWindow.drawText(ch.bio, 0, 96, 400, "left");
        }

        selectCharacter() {
            const ch = characters[this._index];
            $gameParty._actors = [];
            $gameParty.addActor(ch.actorId);

            SceneManager.pop();
            SceneManager.goto(Scene_Map);
        }
    }

    // Перехват New Game
    const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
    Scene_Title.prototype.commandNewGame = function() {
        _Scene_Title_commandNewGame.call(this);
        SceneManager.push(Scene_CharacterSelect);
    };

})();
