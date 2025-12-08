/*:
 * @target MZ
 * @plugindesc Interactive character select screen with wrapped bio, scalable portraits, cursor sound, and adjusted positions
 * @param BackgroundImage
 * @type file
 * @dir img/pictures
 * @default Panel_BG
 * @param PortraitScale
 * @type number
 * @min 0.1
 * @decimals 2
 * @default 0.7
 * @param UnselectedOpacity
 * @type number
 * @min 0
 * @max 255
 * @default 120
 */

(() => {
const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);
const BG = String(params.BackgroundImage || "Panel_BG");
const PortraitScale = Number(params.PortraitScale || 0.7); // немного меньше
const UnselectedOpacity = Number(params.UnselectedOpacity || 120);

const characters = [
    { name:"Osmond", klass:"Scout", bio:"Independent scout-assassin from Gyorn. Kills for principles, not money. Skilled with melee weapons and tracking targets.", smallPortrait:"portrait1_small", largePortrait:"portrait1_large", actorId:1 },
    { name:"Patricia", klass:"Renegade", bio:"Renegade, formerly held a high rank in Abimhore, now a fugitive half-blood. Skilled at gaining influence over others.", smallPortrait:"portrait2_small", largePortrait:"portrait2_large", actorId:2 },
    { name:"Davor", klass:"Ex-Miner", bio:"Mutant, strong in hand-to-hand combat. Brutal and resilient, adapted to underground survival.", smallPortrait:"portrait3_small", largePortrait:"portrait3_large", actorId:3 },
    { name:"Rina", klass:"Mage", bio:"A young mage with exceptional skill in elemental spells.", smallPortrait:"portrait4_small", largePortrait:"portrait4_large", actorId:4 },
    { name:"Thor", klass:"Warrior", bio:"A stalwart warrior, heavily armored, excels in melee combat.", smallPortrait:"portrait5_small", largePortrait:"portrait5_large", actorId:5 },
    { name:"Lysa", klass:"Ranger", bio:"A ranger with great precision and agility, expert in ranged weapons.", smallPortrait:"portrait6_small", largePortrait:"portrait6_large", actorId:6 }
];

class Scene_CharacterSelect extends Scene_MenuBase {
    initialize() {
        super.initialize();
        this._index = 0;
    }

    create() {
        super.create();
        this.createBackground();
        this.createSmallPortraits();
        this.createLargePortrait();
        this.createInfoWindow();
        this.updateSelection();
    }

    createBackground() {
        if (BG) {
            this._bgSprite = new Sprite(ImageManager.loadPicture(BG));
            this._bgSprite.x = 0;
            this._bgSprite.y = 0;
            this.addChildAt(this._bgSprite, 0);
        }
    }

    createSmallPortraits() {
        this._smallPortraits = [];
        const spacing = 120; // чуть ближе друг к другу
        const startX = Graphics.width / 2 - spacing * (characters.length - 1) / 2;
        const startY = 80; // чуть ниже верхнего края

        characters.forEach((ch, i) => {
            const sprite = new Sprite(ImageManager.loadPicture(ch.smallPortrait));
            sprite.x = startX + spacing * i;
            sprite.y = startY;
            sprite.anchor.set(0.5);
            sprite.scale.x = sprite.scale.y = PortraitScale;
            sprite.opacity = UnselectedOpacity;
            this.addChild(sprite);
            this._smallPortraits.push(sprite);
        });
    }

    createLargePortrait() {
        this._largePortrait = new Sprite();
        this._largePortrait.anchor.set(0.5, 0.5);
        this._largePortrait.x = Graphics.width - 260; 
        this._largePortrait.y = 380;                 
        this.addChild(this._largePortrait);
    }

    createInfoWindow() {
        const w = 280;   
        const h = 300;
        const x = 40;
        const y = 200;
        this._infoWindow = new Window_Base(new Rectangle(x, y, w, h));
        this.addChild(this._infoWindow);
    }

    update() {
        super.update();
        this.updateMouse();

        if (Input.isRepeated("right")) this.changeIndex(1);
        if (Input.isRepeated("left")) this.changeIndex(-1);
        if (Input.isTriggered("ok") || TouchInput.isTriggered()) this.selectCharacter();
        if (Input.isTriggered("escape")) SceneManager.pop();
    }

    updateMouse() {
        const mx = TouchInput.x;
        const my = TouchInput.y;
        this._smallPortraits.forEach((s, i) => {
            const w = 64 * PortraitScale;
            const h = 64 * PortraitScale;
            if (mx >= s.x - w && mx <= s.x + w && my >= s.y - h && my <= s.y + h) {
                if (this._index !== i) {
                    this._index = i;
                    SoundManager.playCursor();
                    this.updateSelection();
                }
            }
        });
    }

    changeIndex(delta) {
        this._index = (this._index + delta + characters.length) % characters.length;
        SoundManager.playCursor();
        this.updateSelection();
    }

    updateSelection() {
        const ch = characters[this._index];

        this._smallPortraits.forEach((s, i) => {
            s.opacity = (i === this._index) ? 255 : UnselectedOpacity;
        });

        this._largePortrait.bitmap = ImageManager.loadPicture(ch.largePortrait);

        const win = this._infoWindow;
        win.contents.clear();
        let y = 0;
        win.drawText(ch.name, 0, y, win.contents.width); y += 36;
        win.drawText(ch.klass, 0, y, win.contents.width); y += 36;
        y += 28; // пустой абзац
        this.drawWrappedText(win, ch.bio, 0, y);
    }

    drawWrappedText(win, text, x, y) {
        const maxWidth = win.contents.width;
        const words = text.split(" ");
        let line = "";
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const width = win.contents.measureTextWidth(testLine);
            if (width > maxWidth && i > 0) {
                win.drawText(line, x, y, maxWidth);
                line = words[i] + " ";
                y += 28;
            } else {
                line = testLine;
            }
        }
        win.drawText(line, x, y, maxWidth);
    }

    selectCharacter() {
        const ch = characters[this._index];
        $gameParty._actors = [];
        $gameParty.addActor(ch.actorId);
        SceneManager.goto(Scene_Map);
    }
}

const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    _Scene_Title_commandNewGame.call(this);
    SceneManager.push(Scene_CharacterSelect);
};
})();
