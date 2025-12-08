/*:
 * @target MZ
 * @plugindesc Full Character Select Screen for 816x624 game, 6 characters, mouse, animated, customizable text
 *
 * @param InfoWindowX
 * @text Info Window X
 * @default 40
 * @param InfoWindowY
 * @text Info Window Y
 * @default 300
 * @param InfoWindowW
 * @text Info Window Width
 * @default 360
 * @param InfoWindowH
 * @text Info Window Height
 * @default 300
 *
 * @param BustX
 * @text Bust X
 * @default 620
 * @param BustY
 * @text Bust Y
 * @default 312
 *
 * @param PortraitStartX
 * @text Portrait Start X
 * @default 120
 * @param PortraitY
 * @text Portrait Y
 * @default 60
 * @param PortraitSpacing
 * @text Portrait Spacing
 * @default 140
 *
 * @param SmallScale
 * @text Small Portrait Scale
 * @default 1.0
 * @param LargeScale
 * @text Large Portrait Scale
 * @default 1.0
 *
 * @param UnselectedOpacity
 * @text Unselected Portrait Opacity
 * @default 120
 *
 * @param CharacterTexts
 * @text Character Texts (JSON)
 * @default [{"name":"Osmond","klass":"Scout","bio":"Independent assassin from Gyorn.\nKills for principles, not money.\n\nSkilled with daggers.","small":"portrait1_small","large":"portrait1_large","actorId":1},{"name":"Patricia","klass":"Renegade","bio":"Former Abundhord officer.\nFugitive half-blood.\n\nSkilled at manipulating others.","small":"portrait2_small","large":"portrait2_large","actorId":2},{"name":"Devor","klass":"Mutant","bio":"Strong melee fighter.\nHardened by the mines.\n\nHates authority.","small":"portrait3_small","large":"portrait3_large","actorId":3}]
 */

(() => {
    const params = PluginManager.parameters("CharacterSelect");

    const CFG = {
        infoX: Number(params.InfoWindowX),
        infoY: Number(params.InfoWindowY),
        infoW: Number(params.InfoWindowW),
        infoH: Number(params.InfoWindowH),
        bustX: Number(params.BustX),
        bustY: Number(params.BustY),
        portX: Number(params.PortraitStartX),
        portY: Number(params.PortraitY),
        spacing: Number(params.PortraitSpacing),
        smallScale: Number(params.SmallScale),
        largeScale: Number(params.LargeScale),
        unselectedOpacity: Number(params.UnselectedOpacity)
    };

    // Загружаем персонажей из параметров плагина (JSON)
    const characters = JSON.parse(params.CharacterTexts);

    class Scene_CharacterSelect extends Scene_MenuBase {
        initialize() {
            super.initialize();
            this._index = 0;
        }

        create() {
            super.create();
            this.createBackground();   // фон первым
            this.createPortraits();
            this.createBust();
            this.createInfoWindow();
            this.updateSelection();
        }

        createBackground() {
            this._bg = new Sprite(ImageManager.loadPicture("Panel_BG"));
            this._bg.x = Graphics.width / 2;
            this._bg.y = Graphics.height / 2;
            this._bg.anchor.set(0.5);
            this.addChildToBack(this._bg); // фон всегда под всеми элементами
        }

        createPortraits() {
            this._portraits = [];
            characters.forEach((ch, i) => {
                const sp = new Sprite(ImageManager.loadPicture(ch.small));
                sp.x = CFG.portX + i * CFG.spacing;
                sp.y = CFG.portY;
                sp.anchor.set(0.5);
                sp.scale.set(CFG.smallScale);
                sp.opacity = CFG.unselectedOpacity;
                this.addChild(sp);
                this._portraits.push(sp);
            });
        }

        createBust() {
            this._bust = new Sprite();
            this._bust.anchor.set(0.5);
            this._bust.x = CFG.bustX;
            this._bust.y = CFG.bustY;
            this._bust.scale.set(CFG.largeScale);
            this.addChild(this._bust);
        }

        createInfoWindow() {
            this._info = new Window_Base(new Rectangle(CFG.infoX, CFG.infoY, CFG.infoW, CFG.infoH));
            this.addChild(this._info);
        }

        update() {
            super.update();
            if (Input.isRepeated("right")) this.changeIndex(1);
            if (Input.isRepeated("left")) this.changeIndex(-1);
            if (Input.isTriggered("ok")) this.selectCharacter();
            this.updateMouse();
        }

        updateMouse() {
            if (!TouchInput.isMoved()) return;
            this._portraits.forEach((p, i) => {
                const dx = TouchInput.x - p.x;
                const dy = TouchInput.y - p.y;
                if (Math.abs(dx) < 50 && Math.abs(dy) < 50) {
                    this._index = i;
                    this.updateSelection();
                }
            });
            if (TouchInput.isTriggered()) this.selectCharacter();
        }

        changeIndex(d) {
            this._index = (this._index + d + characters.length) % characters.length;
            this.updateSelection();
        }

        updateSelection() {
            const ch = characters[this._index];

            this._portraits.forEach((p, i) => {
                p.opacity = i === this._index ? 255 : CFG.unselectedOpacity;
            });

            this._bust.bitmap = ImageManager.loadPicture(ch.large);

            this._info.contents.clear();
            this.drawFormattedText(this._info, ch.name + "\n" + ch.klass + "\n\n" + ch.bio);
        }

        drawFormattedText(win, text) {
            const lines = text.split("\n");
            let y = 0;
            const maxWidth = win.contents.width;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim() === "") {
                    y += 28; // пустая строка
                    continue;
                }
                const words = lines[i].split(" ");
                let buffer = "";
                for (let w = 0; w < words.length; w++) {
                    const test = buffer + words[w] + " ";
                    if (win.contents.measureTextWidth(test) > maxWidth) {
                        win.drawText(buffer, 0, y, maxWidth);
                        buffer = words[w] + " ";
                        y += 28;
                    } else buffer = test;
                }
                win.drawText(buffer, 0, y, maxWidth);
                y += 28;
            }
        }

        selectCharacter() {
            const ch = characters[this._index];
            $gameParty._actors = [];
            $gameParty.addActor(ch.actorId);

            $gamePlayer.reserveTransfer(1, 10, 10, 2, 0); // ID карты=1, координаты=10,10
            SceneManager.goto(Scene_Map);
        }
    }

    const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
    Scene_Title.prototype.commandNewGame = function () {
        _Scene_Title_commandNewGame.call(this);
        SceneManager.push(Scene_CharacterSelect);
    };
})();
