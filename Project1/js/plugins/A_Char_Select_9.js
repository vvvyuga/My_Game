/*:
 * @target MZ
 * @plugindesc Character selection screen with name input and auto transfer to map BERKAN_BEACH v1.0
 *
 * @param PortraitSpacing
 * @text Portrait Vertical Spacing
 * @type number
 * @default 10
 *
 * @param PortraitOffsetX
 * @text Portrait List Offset X
 * @type number
 * @default 0
 *
 * @param PortraitOffsetY
 * @text Portrait List Offset Y
 * @type number
 * @default 0
 *
 * @param ClassWindowX
 * @text Class Window X
 * @type number
 * @default 520
 *
 * @param ClassWindowY
 * @text Class Window Y
 * @type number
 * @default 100
 *
 * @param ClassWindowWidth
 * @text Class Window Width
 * @type number
 * @default 300
 *
 * @param ClassWindowHeight
 * @text Class Window Height
 * @type number
 * @default 58
 *
 * @param AgeWindowX
 * @text Age Window X
 * @type number
 * @default 520
 *
 * @param AgeWindowY
 * @text Age Window Y
 * @type number
 * @default 168
 *
 * @param AgeWindowWidth
 * @text Age Window Width
 * @type number
 * @default 300
 *
 * @param AgeWindowHeight
 * @text Age Window Height
 * @type number
 * @default 58
 *
 * @param InfoWindowX
 * @text Bio Window X
 * @type number
 * @default 520
 *
 * @param InfoWindowY
 * @text Bio Window Y
 * @type number
 * @default 236
 *
 * @param InfoWindowWidth
 * @text Bio Window Width
 * @type number
 * @default 300
 *
 * @param InfoWindowHeight
 * @text Bio Window Height
 * @type number
 * @default 212
 *
 * @param ChooseWindowX
 * @text Choose Window X
 * @type number
 * @default 40
 *
 * @param ChooseWindowY
 * @text Choose Window Y
 * @type number
 * @default 30
 *
 * @param ChooseWindowWidth
 * @text Choose Window Width
 * @type number
 * @default 880
 *
 * @param ChooseWindowHeight
 * @text Choose Window Height
 * @type number
 * @default 58
 *
 * @param BustX
 * @text Bust X
 * @type number
 * @default 320
 *
 * @param BustY
 * @text Bust Y
 * @type number
 * @default 200
 *
 * @param BustScale
 * @text Bust Scale
 * @type number
 * @decimals 2
 * @default 1.08
 *
 * @param PortraitScale
 * @text Small Portrait Scale
 * @type number
 * @decimals 2
 * @default 0.8
 *
 * @param PortraitOpacity
 * @text Small Portrait Opacity
 * @type number
 * @default 120
 */

(() => {

const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);

const PORTRAIT_SPACING = Number(params.PortraitSpacing || 10);
const PORTRAIT_OFFSET_X = Number(params.PortraitOffsetX || 0);
const PORTRAIT_OFFSET_Y = Number(params.PortraitOffsetY || 0);
const PORTRAIT_SCALE = Number(params.PortraitScale || 0.8);
const PORTRAIT_OPACITY = Number(params.PortraitOpacity || 120);

const BUST_X = Number(params.BustX || 320);
const BUST_Y = Number(params.BustY || 200);
const BUST_SCALE = Number(params.BustScale || 1.08);
const BUST_SLIDE_DIST = 30;
const BUST_SLIDE_SPEED = 0.15;

const CLASS_X = Number(params.ClassWindowX || 520);
const CLASS_Y = Number(params.ClassWindowY || 100);
const CLASS_W = Number(params.ClassWindowWidth || 300);
const CLASS_H = Number(params.ClassWindowHeight || 58);

const AGE_X = Number(params.AgeWindowX || 520);
const AGE_Y = Number(params.AgeWindowY || 168);
const AGE_W = Number(params.AgeWindowWidth || 300);
const AGE_H = Number(params.AgeWindowHeight || 58);

const INFO_X = Number(params.InfoWindowX || 520);
const INFO_Y = Number(params.InfoWindowY || 236);
const INFO_W = Number(params.InfoWindowWidth || 300);
const INFO_H = Number(params.InfoWindowHeight || 212);

const CHOOSE_X = Number(params.ChooseWindowX || 40);
const CHOOSE_Y = Number(params.ChooseWindowY || 30);
const CHOOSE_W = Number(params.ChooseWindowWidth || 880);
const CHOOSE_H = Number(params.ChooseWindowHeight || 58);

const LIST_X = 40 + PORTRAIT_OFFSET_X;
const LIST_Y = 100 + PORTRAIT_OFFSET_Y;
const PORTRAIT_W = 90;
const PORTRAIT_H = 90;

const characters = [
  { name:"OSMOND", klass:"SCOUT", age:25, bio:"Independent scout-assassin from Gyorn. Kills for principles, not money.", smallPortrait:"portrait1_small", largePortrait:"portrait1_large", actorId:1 },
  { name:"PATRICIA", klass:"EX-POLITICIAN", age:30, bio:"Renegade, formerly held a high rank in Abimhore. Now a fugitive half-blood.", smallPortrait:"portrait2_small", largePortrait:"portrait2_large", actorId:2 },
  { name:"DAVOR", klass:"EX-MINER", age:28, bio:"Mutant, strong in hand-to-hand combat. Brutal and resilient.", smallPortrait:"portrait3_small", largePortrait:"portrait3_large", actorId:3 },
  { name:"ELYRA", klass:"MAGE", age:22, bio:"Talented in elemental magic. Quick learner.", smallPortrait:"portrait4_small", largePortrait:"portrait4_large", actorId:4 },
  { name:"ZARA", klass:"ROGUE", age:26, bio:"Stealthy and cunning thief from the slums.", smallPortrait:"portrait5_small", largePortrait:"portrait5_large", actorId:5 }
];

class Scene_CharacterSelect extends Scene_MenuBase {
  create() {
    super.create();
    this._index = 0;
    this._targetY = BUST_Y;

    this.createBackground();
    this.createLargePortrait();
    this.createChooseWindow();
    this.createPortraitList();
    this.createInfoWindows();

    this.updateSelection();
  }

  createBackground() {
    this._bg = new Sprite(ImageManager.loadPicture("Panel_BG"));
    this.addChildAt(this._bg, 0);
  }

  createChooseWindow() {
    this._chooseWindow = new Window_Base(new Rectangle(CHOOSE_X, CHOOSE_Y, CHOOSE_W, CHOOSE_H));
    this._chooseWindow.contents.clear();
    this._chooseWindow.drawText("CHOOSE CHARACTER", 0, 0, CHOOSE_W, "center");
    this.addChild(this._chooseWindow);
  }

  createPortraitList() {
    this._portraitSprites = [];
    characters.forEach((ch, i) => {
      const y = LIST_Y + i * (PORTRAIT_H + PORTRAIT_SPACING);
      const win = new Window_Base(new Rectangle(LIST_X, y, PORTRAIT_W, PORTRAIT_H));
      this.addChild(win);

      const sp = new Sprite(ImageManager.loadPicture(ch.smallPortrait));
      sp.anchor.set(0.5);
      sp.scale.set(PORTRAIT_SCALE);
      sp.x = win.width / 2;
      sp.y = win.height / 2;
      sp.opacity = PORTRAIT_OPACITY;
      win.addChild(sp);
      this._portraitSprites.push(sp);
    });
  }

  createLargePortrait() {
    this._largePortrait = new Sprite();
    this._largePortrait.anchor.set(0.5);
    this._largePortrait.scale.set(BUST_SCALE);
    this._largePortrait.x = BUST_X;
    this._largePortrait.y = BUST_Y + BUST_SLIDE_DIST;
    this.addChild(this._largePortrait);
  }

  createInfoWindows() {
    this._classWindow = new Window_Base(new Rectangle(CLASS_X, CLASS_Y, CLASS_W, CLASS_H));
    this._ageWindow = new Window_Base(new Rectangle(AGE_X, AGE_Y, AGE_W, AGE_H));
    this._infoWindow = new Window_Base(new Rectangle(INFO_X, INFO_Y, INFO_W, INFO_H));
    this.addChild(this._classWindow);
    this.addChild(this._ageWindow);
    this.addChild(this._infoWindow);
  }

  update() {
    super.update();
    this.updateBustSlide();

    if (Input.isRepeated("down")) this.changeIndex(1);
    if (Input.isRepeated("up")) this.changeIndex(-1);
    if (Input.isTriggered("ok")) this.openNameInput();
  }

  updateBustSlide() {
    if (this._largePortrait.y > this._targetY) {
      this._largePortrait.y -= BUST_SLIDE_SPEED * BUST_SLIDE_DIST;
      if (this._largePortrait.y < this._targetY) this._largePortrait.y = this._targetY;
    } else if (this._largePortrait.y < this._targetY) {
      this._largePortrait.y = this._targetY;
    }
  }

  changeIndex(delta) {
    this._index = (this._index + delta + characters.length) % characters.length;
    SoundManager.playCursor();
    this.updateSelection();
    this._largePortrait.y = BUST_Y + BUST_SLIDE_DIST;
  }

  updateSelection() {
    const ch = characters[this._index];
    this._portraitSprites.forEach((sp, i) => sp.opacity = i === this._index ? 255 : PORTRAIT_OPACITY);
    this._largePortrait.bitmap = ImageManager.loadPicture(ch.largePortrait);

    this._classWindow.contents.clear();
    this._ageWindow.contents.clear();
    this._infoWindow.contents.clear();
    this._classWindow.drawText("CLASS: " + ch.klass, 0, 0, CLASS_W, "left");
    this._ageWindow.drawText("AGE: " + ch.age, 0, 0, AGE_W, "left");
    this.drawWrappedText(this._infoWindow, ch.bio, 0, 0);
  }

  drawWrappedText(win, text, x, y) {
    const maxWidth = win.contents.width;
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

  openNameInput() {
    const ch = characters[this._index];
    const actor = $gameActors.actor(ch.actorId);

    const editRect = new Rectangle(0, 0, Graphics.width, 100);
    const inputRect = new Rectangle(0, 100, Graphics.width, 400);

    this._nameEditWindow = new Window_NameEdit(actor, editRect);
    this._nameInputWindow = new Window_NameInput(inputRect, this._nameEditWindow.maxLength());
    this._nameEditWindow.setNameInputWindow(this._nameInputWindow);

    this._nameInputWindow.setHandler("ok", this.onNameOk.bind(this));

    this.addChild(this._nameEditWindow);
    this.addChild(this._nameInputWindow);
  }

  onNameOk() {
    this._nameEditWindow.hide();
    this._nameInputWindow.hide();

    // перенос на карту BERKAN_BEACH (001)
    $gamePlayer.reserveTransfer(1, 10, 10, 2, 0); // ID 1, x=10, y=10, dir=2
    SceneManager.goto(Scene_Map);
  }
}

const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
  _Scene_Title_commandNewGame.call(this);
  SceneManager.push(Scene_CharacterSelect);
};
})();
