/*:
 * @target MZ
 * @plugindesc Character selection screen FINAL UI FIX v11 (windows lower + bust slide-in bottom-up + back to menu)
 *
 * @param PortraitScale
 * @text Portrait Scale
 * @type number
 * @decimals 2
 * @default 0.80
 *
 * @param PortraitOpacity
 * @text Non-selected Portrait Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 120
 *
 * @param WindowShiftY
 * @text Shift text windows down (pixels)
 * @type number
 * @default 6
 *
 * @param BustSlideDistance
 * @text Large Bust Slide Distance (pixels)
 * @type number
 * @default 30
 *
 * @param BustSlideSpeed
 * @text Large Bust Slide Speed
 * @type number
 * @default 0.15
 */

(() => {

const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);
const PORTRAIT_SCALE = Number(params.PortraitScale || 0.8);
const PORTRAIT_OPACITY = Number(params.PortraitOpacity || 120);
const WINDOW_SHIFT_Y = Number(params.WindowShiftY || 6);
const BUST_SLIDE_DIST = Number(params.BustSlideDistance || 30);
const BUST_SLIDE_SPEED = Number(params.BustSlideSpeed || 0.15);

const CENTER_SHIFT_X = 40;
const BG_IMAGE = "Panel_BG";
const LARGE_SCALE = 1.08;
const LARGE_X = 520 + CENTER_SHIFT_X;
const LARGE_Y = 340;

const INFO_W = 300;
const NAME_X = 40 + CENTER_SHIFT_X;
const NAME_Y = 148 + WINDOW_SHIFT_Y;
const GAP = 12;
const NAME_H = 58;
const CLASS_H = 58;
const CLASS_Y = NAME_Y + NAME_H + GAP;
const INFO_Y = CLASS_Y + CLASS_H + GAP;
const INFO_H = 212;

const characters = [
    {name:"OSMOND", klass:"SCOUT", bio:"Independent scout-assassin from Gyorn. Kills for principles, not money.", smallPortrait:"portrait1_small", largePortrait:"portrait1_large", actorId:1},
    {name:"PATRICIA", klass:"EX-POLITICIAN", bio:"Renegade, formerly held a high rank in Abimhore. Now a fugitive half-blood.", smallPortrait:"portrait2_small", largePortrait:"portrait2_large", actorId:2},
    {name:"DAVOR", klass:"EX-MINER", bio:"Mutant, strong in hand-to-hand combat. Brutal and resilient.", smallPortrait:"portrait3_small", largePortrait:"portrait3_large", actorId:3},
    {name:"ELYRA", klass:"MAGE", bio:"Talented in elemental magic. Quick learner.", smallPortrait:"portrait4_small", largePortrait:"portrait4_large", actorId:4},
    {name:"KORR", klass:"WARRIOR", bio:"Experienced fighter. Uses brute strength.", smallPortrait:"portrait5_small", largePortrait:"portrait5_large", actorId:5},
    {name:"NIRA", klass:"ROGUE", bio:"Stealthy and cunning. Master of locks.", smallPortrait:"portrait6_small", largePortrait:"portrait6_large", actorId:6}
];

class Scene_CharacterSelect extends Scene_MenuBase {
    create() {
        super.create();
        this._index = 0;
        this._targetY = LARGE_Y;

        this.createBackground();
        this.createPortraitSprites();
        this.createLargePortrait();
        this.createNameWindow();
        this.createClassWindow();
        this.createInfoWindow();

        this.updateSelection();
    }

    createBackground() {
        this._bg = new Sprite(ImageManager.loadPicture(BG_IMAGE));
        this.addChildAt(this._bg, 0);
    }

    createPortraitSprites() {
        this._portraitSprites = [];
        const spacing = 114;
        const startX = (Graphics.width - spacing*(characters.length-1))/2;
        const startY = 64;

        characters.forEach((ch, i)=>{
            const sp = new Sprite(ImageManager.loadPicture(ch.smallPortrait));
            sp.anchor.set(0.5,0.5);
            sp.scale.x = sp.scale.y = PORTRAIT_SCALE;
            sp.x = startX + spacing*i;
            sp.y = startY;
            sp.opacity = PORTRAIT_OPACITY;
            this.addChild(sp);
            this._portraitSprites.push(sp);
        });
    }

    createLargePortrait() {
        this._largePortrait = new Sprite();
        this._largePortrait.anchor.set(0.5);
        this._largePortrait.scale.set(LARGE_SCALE);
        this._largePortrait.x = LARGE_X;
        this._largePortrait.y = LARGE_Y + BUST_SLIDE_DIST;
        this.addChild(this._largePortrait);
    }

    createNameWindow() {
        this._nameWindow = new Window_Base(new Rectangle(NAME_X, NAME_Y, INFO_W, NAME_H));
        this.addChild(this._nameWindow);
    }

    createClassWindow() {
        this._classWindow = new Window_Base(new Rectangle(NAME_X, CLASS_Y, INFO_W, CLASS_H));
        this.addChild(this._classWindow);
    }

    createInfoWindow() {
        this._infoWindow = new Window_Base(new Rectangle(NAME_X, INFO_Y, INFO_W, INFO_H));
        this.addChild(this._infoWindow);
    }

    update() {
        super.update();
        this.updateBustSlide();

        if (Input.isRepeated("right")) this.changeIndex(1);
        if (Input.isRepeated("left")) this.changeIndex(-1);
        if (Input.isTriggered("ok")) this.selectCharacter();
        if (Input.isTriggered("cancel")) this.returnToTitle(); // возможность выхода назад
    }

    updateBustSlide() {
        if(this._largePortrait.y > this._targetY){
            this._largePortrait.y -= BUST_SLIDE_SPEED * BUST_SLIDE_DIST;
            if(this._largePortrait.y < this._targetY) this._largePortrait.y = this._targetY;
        } else if(this._largePortrait.y < this._targetY){
            this._largePortrait.y = this._targetY;
        }
    }

    changeIndex(delta) {
        this._index = (this._index + delta + characters.length) % characters.length;
        SoundManager.playCursor();
        this.updateSelection();
        this._largePortrait.y = LARGE_Y + BUST_SLIDE_DIST;
    }

    updateSelection() {
        const ch = characters[this._index];
        this._portraitSprites.forEach((sp,i)=>{sp.opacity = (i===this._index)?255:PORTRAIT_OPACITY;});
        this._largePortrait.bitmap = ImageManager.loadPicture(ch.largePortrait);

        this._nameWindow.contents.clear();
        this._classWindow.contents.clear();
        this._infoWindow.contents.clear();

        this._nameWindow.drawText("CHOOSE CHARACTER", 10, 6, INFO_W-20, "left");
        this._classWindow.drawText("CLASS: " + ch.klass, 10, 6, INFO_W-20, "left");

        this.drawWrappedText(this._infoWindow, ch.bio, 10, 0);
    }

    drawWrappedText(win, text, x, y) {
        const maxWidth = win.contents.width - 20;
        const words = text.split(" ");
        let line = "";
        for (let i=0;i<words.length;i++){
            const test = line + words[i] + " ";
            if(win.contents.measureTextWidth(test) > maxWidth && i>0){
                win.drawText(line, x, y, maxWidth, "left");
                line = words[i]+" ";
                y += 26;
            } else line = test;
        }
        win.drawText(line, x, y, maxWidth, "left");
    }

    selectCharacter() {
        const ch = characters[this._index];
        $gameParty._actors = [];
        $gameParty.addActor(ch.actorId);
        SoundManager.playOk();
        SceneManager.push(Scene_Name);
        SceneManager.prepareNextScene(ch.actorId, 8);
    }

    returnToTitle() {
        SoundManager.playCancel();
        SceneManager.pop(); // возврат в главное меню
    }
}

// ==== ПЕРЕХВАТ NEW GAME ====
const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function(){
    _Scene_Title_commandNewGame.call(this);
    SceneManager.push(Scene_CharacterSelect);
};

})();
