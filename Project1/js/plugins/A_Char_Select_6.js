/*:
 * @target MZ
 * @plugindesc Character Select – Full Width Header, Movable Info Windows, Right-Aligned Text
 *
 * @param LeftOffset
 * @text Left Offset (px)
 * @type number
 * @default 40
 *
 * @param RightOffset
 * @text Right Offset (px)
 * @type number
 * @default 40
 *
 * @param TopOffset
 * @text Top Offset (px)
 * @type number
 * @default 20
 *
 * @param BottomOffset
 * @text Bottom Offset (px)
 * @type number
 * @default 20
 *
 * @param InfoWindowWidth
 * @text Info Windows Width
 * @type number
 * @default 260
 *
 * @param InfoWindowOffsetX
 * @text Info Windows Offset X (px)
 * @type number
 * @default 0
 *
 * @param InfoWindowOffsetY
 * @text Info Windows Offset Y (px)
 * @type number
 * @default 0
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

const pluginName = document.currentScript.src.match(/([^\/]+)\.js$/)[1];
const params = PluginManager.parameters(pluginName);

const LEFT   = Number(params.LeftOffset || 40);
const RIGHT  = Number(params.RightOffset || 40);
const TOP    = Number(params.TopOffset || 20);
const BOTTOM = Number(params.BottomOffset || 20);

const INFO_W = Number(params.InfoWindowWidth || 260);
const INFO_OFFSET_X = Number(params.InfoWindowOffsetX || 0);
const INFO_OFFSET_Y = Number(params.InfoWindowOffsetY || 0);

const PORTRAIT_SCALE = Number(params.PortraitScale || 0.64);
const PORTRAIT_OPACITY = Number(params.PortraitOpacity || 110);
const PORTRAIT_SPACING = Number(params.PortraitSpacing || 10);

const PORTRAIT_X = LEFT;
const PORTRAIT_Y = TOP + 80;
const PORTRAIT_W = 90;
const PORTRAIT_H = 90;

const LARGE_X = 360;
const LARGE_Y = 360;
const LARGE_SCALE = 1.08;

const GAP = 10;
const NAME_H = 58;
const CLASS_H = 58;
const INFO_H = 212;

// Правая сторона с учетом оффсета
const INFO_X = Graphics.width - RIGHT - INFO_W + INFO_OFFSET_X;

// Окно имени — на всю ширину экрана, выровнено по верхней границе
const NAME_X = LEFT;
const NAME_Y = TOP;
const NAME_W = Graphics.width - LEFT - RIGHT;
const NAME_OFFSET_Y = 0;

// Параметры окон с текстом (био, класс, возраст)
const CLASS_Y = NAME_Y + NAME_H + GAP + INFO_OFFSET_Y;
const INFO_Y  = CLASS_Y + CLASS_H + GAP;
const AGE_Y   = INFO_Y + INFO_H + GAP; // если понадобится возраст

// -------------------- CHARACTERS --------------------

const characters = [
  { name:"OSMOND",   klass:"ASSASSIN", bio:"Independent scout-assassin from Gyorn. Kills for principles, not money.", small:"portrait1_small", large:"portrait1_large", actorId:1 },
  { name:"PATRICIA", klass:"EX-CULTIST", bio:"Former Abimhore elite, now a fugitive half-blood.", small:"portrait2_small", large:"portrait2_large", actorId:2 },
  { name:"DAVOR",    klass:"EX-MINER", bio:"Mutant brute fighter. Brutal and resilient.", small:"portrait3_small", large:"portrait3_large", actorId:3 },
  { name:"ELYRA",    klass:"PSYCHOMANCER", bio:"Elemental prodigy. Fast learner.", small:"portrait4_small", large:"portrait4_large", actorId:4 }
];

// -------------------- SCENE --------------------

class Scene_CharacterSelect extends Scene_MenuBase {

  create() {
    super.create();
    this._index = 0;

    this.createBackground();
    this.createLargePortrait();
    this.createNameWindow();
    this.createPortraitList();
    this.createInfoWindows();

    this.updateSelection();
  }

  createBackground() {
    this._bg = new Sprite(ImageManager.loadPicture("Panel_BG"));
    this.addChildAt(this._bg, 0);
  }

  createNameWindow() {
    this._nameWindow = new Window_Base(new Rectangle(NAME_X, NAME_Y + NAME_OFFSET_Y, NAME_W, NAME_H));
    this._nameWindow.drawText("CHOOSE CHARACTER", 0, 0, NAME_W, "center");
    this.addChild(this._nameWindow);
  }

  createPortraitList() {
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

      this._portraitSprites.push(sp);
    });
  }

  createLargePortrait() {
    this._largePortrait = new Sprite();
    this._largePortrait.anchor.set(0.5);
    this._largePortrait.scale.set(LARGE_SCALE);
    this._largePortrait.x = LARGE_X;
    this._largePortrait.y = LARGE_Y;
    this._largePortrait.z = 2; // поверх фона
    this.addChild(this._largePortrait);
  }

  createInfoWindows() {
    this._classWindow = new Window_Base(new Rectangle(INFO_X, CLASS_Y, INFO_W, CLASS_H));
    this._infoWindow  = new Window_Base(new Rectangle(INFO_X, INFO_Y, INFO_W, INFO_H));

    this.addChild(this._classWindow);
    this.addChild(this._infoWindow);
  }

  update() {
    super.update();

    if (Input.isRepeated("down")) this.changeIndex(1);
    if (Input.isRepeated("up"))   this.changeIndex(-1);

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
      sp.opacity = (i === this._index) ? 255 : PORTRAIT_OPACITY;
    });

    this._largePortrait.bitmap = ImageManager.loadPicture(ch.large);

    this._classWindow.contents.clear();
    this._infoWindow.contents.clear();

    this._classWindow.drawText("CLASS: " + ch.klass, 10, 6, INFO_W - 20, "left");
    this.drawWrappedText(this._infoWindow, ch.bio, 10, 0);
  }

  drawWrappedText(win, text, x, y) {
    const maxWidth = win.contents.width - 20;
    const words = text.split(" ");
    let line = "";

    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (win.contents.measureTextWidth(test) > maxWidth && i > 0) {
        win.drawText(line, x, y, maxWidth, "left");
        line = words[i] + " ";
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

// -------------------- HOOK NEW GAME --------------------

const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
  _Scene_Title_commandNewGame.call(this);
  SceneManager.push(Scene_CharacterSelect);
};

})();
