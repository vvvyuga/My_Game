/*:
 * @target MZ
 * @plugindesc Character Select FINAL CLEAN – NO CANCEL, adjustable info width & right offset
 *
 * @param InfoWindowWidth
 * @text Info Windows Width
 * @type number
 * @default 260
 *
 * @param RightOffset
 * @text Right Offset (px)
 * @type number
 * @default 40
 *
 * @param PortraitScale
 * @text Portrait Scale
 * @type number
 * @decimals 2
 * @default 0.64
 *
 * @param PortraitOpacity
 * @text Non-selected Portrait Opacity
 * @type number
 * @default 110
 *
 * @param PortraitSpacing
 * @text Portrait Vertical Spacing
 * @type number
 * @default 10
 */

(() => {

const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);

const INFO_W = Number(params.InfoWindowWidth || 260);
const RIGHT_OFFSET = Number(params.RightOffset || 40);
const PORTRAIT_SCALE = Number(params.PortraitScale || 0.64);
const PORTRAIT_OPACITY = Number(params.PortraitOpacity || 110);
const PORTRAIT_SPACING = Number(params.PortraitSpacing || 10);

const PORTRAIT_X = 40;
const PORTRAIT_Y = 100;
const PORTRAIT_W = 90;
const PORTRAIT_H = 90;

const LARGE_X = 360;
const LARGE_Y = 370;
const LARGE_SCALE = 1.08;

const TOP_OFFSET = 20;
const GAP = 10;
const NAME_H = 58;
const CLASS_H = 58;
const INFO_H = 212;

const INFO_X = Graphics.width - RIGHT_OFFSET - INFO_W;
const NAME_Y = TOP_OFFSET;
const CLASS_Y = NAME_Y + NAME_H + GAP;
const INFO_Y = CLASS_Y + CLASS_H + GAP;

const characters = [
  { name:"OSMOND", klass:"SCOUT", bio:"Independent scout-assassin from Gyorn. Kills for principles, not money.", small:"portrait1_small", large:"portrait1_large", actorId:1 },
  { name:"PATRICIA", klass:"EX-POLITICIAN", bio:"Former Abimhore elite, now a fugitive.", small:"portrait2_small", large:"portrait2_large", actorId:2 },
  { name:"DAVOR", klass:"EX-MINER", bio:"Mutant brute fighter. Brutal and resilient.", small:"portrait3_small", large:"portrait3_large", actorId:3 },
  { name:"ELYRA", klass:"MAGE", bio:"Elemental prodigy. Fast learner.", small:"portrait4_small", large:"portrait4_large", actorId:4 }
];

class Scene_CharacterSelect extends Scene_MenuBase {

  create() {
    super.create();
    this._index = 0;
    this.createBackground();
    this.createPortraitList();
    this.createLargePortrait();
    this.createInfoWindows();
    this.updateSelection();
  }

  createBackground() {
    this._bg = new Sprite(ImageManager.loadPicture("Panel_BG"));
    this.addChildAt(this._bg, 0);
  }

  createPortraitList() {
    this._portraitWindows = [];
    this._portraitSprites = [];

    characters.forEach((ch, i) => {
      const y = PORTRAIT_Y + i * (PORTRAIT_H + PORTRAIT_SPACING);
      const win = new Window_Base(new Rectangle(PORTRAIT_X, y, PORTRAIT_W, PORTRAIT_H));
      this.addChild(win);

      const sp = new Sprite(ImageManager.loadPicture(ch.small));
      sp.anchor.set(0.5);
      sp.scale.set(PORTRAIT_SCALE);
      sp.x = win.width / 2;
      sp.y = win.height / 2;
      win.addChild(sp);

      this._portraitWindows.push(win);
      this._portraitSprites.push(sp);
    });
  }

  createLargePortrait() {
    this._largePortrait = new Sprite();
    this._largePortrait.anchor.set(0.5);
    this._largePortrait.scale.set(LARGE_SCALE);
    this._largePortrait.x = LARGE_X;
    this._largePortrait.y = LARGE_Y;
    this.addChild(this._largePortrait);
  }

  createInfoWindows() {
    this._nameWindow = new Window_Base(new Rectangle(INFO_X, NAME_Y, INFO_W, NAME_H));
    this._classWindow = new Window_Base(new Rectangle(INFO_X, CLASS_Y, INFO_W, CLASS_H));
    this._infoWindow = new Window_Base(new Rectangle(INFO_X, INFO_Y, INFO_W, INFO_H));

    this.addChild(this._nameWindow);
    this.addChild(this._classWindow);
    this.addChild(this._infoWindow);
  }

  update() {
    super.update();
    if (Input.isRepeated("down")) this.changeIndex(1);
    if (Input.isRepeated("up")) this.changeIndex(-1);
    if (Input.isTriggered("ok")) this.selectCharacter();
    if (Input.isTriggered("cancel")) SoundManager.playCancel();
  }

  changeIndex(delta) {
    this._index = (this._index + delta + characters.length) % characters.length;
    SoundManager.playCursor();
    this.updateSelection();
  }

  updateSelection() {
    const ch = characters[this._index];

    this._portraitSprites.forEach((sp,i)=>{
      sp.opacity = (i===this._index)?255:PORTRAIT_OPACITY;
    });

    this._largePortrait.bitmap = ImageManager.loadPicture(ch.large);

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
}

// ▶ Перехват New Game
const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function(){
  _Scene_Title_commandNewGame.call(this);
  SceneManager.push(Scene_CharacterSelect);
};

})();
