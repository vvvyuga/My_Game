/*:
 * @target MZ
 * @plugindesc Character selection screen FINAL UI FIX v29 (customizable Cancel position & portrait scale)
 *
 * @param PortraitSpacing
 * @text Portrait Vertical Spacing
 * @type number
 * @default 10
 *
 * @param InfoWindowsSpacing
 * @text Info Windows Vertical Spacing
 * @type number
 * @default 10
 *
 * @param TopMargin
 * @text Top Margin
 * @type number
 * @default 20
 *
 * @param CancelX
 * @text Cancel Window X
 * @type number
 * @default 520
 *
 * @param CancelY
 * @text Cancel Window Y
 * @type number
 * @default 400
 *
 * @param PortraitScale
 * @text Portrait Scale
 * @type number
 * @decimals 2
 * @default 0.8
 */

(() => {

const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);

const PORTRAIT_SCALE = Number(params.PortraitScale || 0.8);
const PORTRAIT_OPACITY = 120;
const LIST_X = 40; // отступ слева
const LIST_SPACING = Number(params.PortraitSpacing || 10);
const PORTRAIT_W = 90;
const PORTRAIT_H = 90;

const BUST_X = 320;
const BUST_Y = 200;
const BUST_SCALE = 1.08;
const BUST_SLIDE_DIST = 30;
const BUST_SLIDE_SPEED = 0.15;

const CLASS_W = 300;
const CLASS_H = 58;
const AGE_W = 300;
const AGE_H = 58;
const INFO_W = 300;
const INFO_H = 212;

const INFO_X = 520;
const INFO_SPACING = Number(params.InfoWindowsSpacing || 10);
const TOP_MARGIN = Number(params.TopMargin || 20);

const LIST_Y = TOP_MARGIN + 80;
const CLASS_Y = TOP_MARGIN + 80;
const AGE_Y = CLASS_Y + CLASS_H + INFO_SPACING;
const INFO_Y = AGE_Y + AGE_H + INFO_SPACING;

const CANCEL_X = Number(params.CancelX || 520);
const CANCEL_Y = Number(params.CancelY || 400);
const CANCEL_W = CLASS_W;
const CANCEL_H = CLASS_H;

const characters = [
  { name:"OSMOND", klass:"SCOUT", age:25, bio:"Independent scout-assassin from Gyorn. Kills for principles, not money.", smallPortrait:"portrait1_small", largePortrait:"portrait1_large", actorId:1 },
  { name:"PATRICIA", klass:"EX-POLITICIAN", age:30, bio:"Renegade, formerly held a high rank in Abimhore. Now a fugitive half-blood.", smallPortrait:"portrait2_small", largePortrait:"portrait2_large", actorId:2 },
  { name:"DAVOR", klass:"EX-MINER", age:28, bio:"Mutant, strong in hand-to-hand combat. Brutal and resilient.", smallPortrait:"portrait3_small", largePortrait:"portrait3_large", actorId:3 },
  { name:"ELYRA", klass:"MAGE", age:22, bio:"Talented in elemental magic. Quick learner.", smallPortrait:"portrait4_small", largePortrait:"portrait4_large", actorId:4 }
];

// Cancel Button
class Window_CancelButton extends Window_Command {
  initialize(rect) {
    super.initialize(rect);
    this.deactivate();
    this.opacity = 255;
    this.refresh();
  }
  makeCommandList() {
    this.addCommand("Cancel", "cancel");
  }
  drawItem(index) {
    const rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    const text = this.commandName(index);
    this.drawText(text, rect.x, rect.y, rect.width, "center");
  }
  updateCursor() {
    if (this.active) {
      const rect = this.itemRect(this.index());
      this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
      this.setCursorRect(0,0,0,0);
    }
  }
}

// Scene
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
    this.createCancelButton();

    this.updateSelection();
  }

  createBackground() {
    this._bg = new Sprite(ImageManager.loadPicture("Panel_BG"));
    this.addChildAt(this._bg, 0);
  }

  createChooseWindow() {
    const ww = Graphics.width - 80;
    const wh = 58;
    const wx = 40;
    const wy = TOP_MARGIN;
    this._chooseWindow = new Window_Base(new Rectangle(wx, wy, ww, wh));
    this._chooseWindow.contents.clear();
    this._chooseWindow.drawText("CHOOSE CHARACTER", 0, 0, ww, "center");
    this.addChild(this._chooseWindow);
  }

  createPortraitList() {
    this._portraitWindows = [];
    this._portraitSprites = [];
    characters.forEach((ch, i) => {
      const y = LIST_Y + i * (PORTRAIT_H + LIST_SPACING);
      const win = new Window_Base(new Rectangle(LIST_X, y, PORTRAIT_W, PORTRAIT_H));
      this.addChild(win);
      this._portraitWindows.push(win);

      const sp = new Sprite(ImageManager.loadPicture(ch.smallPortrait));
      sp.anchor.set(0.5); // центр в окне
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
    this._classWindow = new Window_Base(new Rectangle(INFO_X, CLASS_Y, CLASS_W, CLASS_H));
    this._ageWindow = new Window_Base(new Rectangle(INFO_X, AGE_Y, AGE_W, AGE_H));
    this._infoWindow = new Window_Base(new Rectangle(INFO_X, INFO_Y, INFO_W, INFO_H));

    this.addChild(this._classWindow);
    this.addChild(this._ageWindow);
    this.addChild(this._infoWindow);
  }

  createCancelButton() {
    this._cancelButton = new Window_CancelButton(new Rectangle(CANCEL_X, CANCEL_Y, CANCEL_W, CANCEL_H));
    this._cancelButton.setHandler("cancel", this.returnToTitle.bind(this));
    this.addChild(this._cancelButton);
  }

  update() {
    super.update();
    this.updateBustSlide();

    if (Input.isRepeated("down")) this.changeIndex(1);
    if (Input.isRepeated("up")) this.changeIndex(-1);
    if (Input.isRepeated("right") && this._index === characters.length -1) {
      this._cancelButton.activate();
    }
    if (Input.isRepeated("left") && this._cancelButton.active) {
      this._cancelButton.deactivate();
      this._index = characters.length -1;
      this.updateSelection();
    }

    if (this._cancelButton.active) {
      this._cancelButton.processCursorMove();
      if (Input.isTriggered("ok")) this._cancelButton.processOk();
    } else {
      if (Input.isTriggered("ok")) this.selectCharacter();
    }

    if (Input.isTriggered("cancel")) this.returnToTitle();
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

  selectCharacter() {
    const ch = characters[this._index];
    $gameParty._actors = [];
    $gameParty.addActor(ch.actorId);
    SoundManager.playOk();
  }

  returnToTitle() {
    SoundManager.playCancel();
    SceneManager.pop();
  }
}

// Title hook
const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
  _Scene_Title_commandNewGame.call(this);
  SceneManager.push(Scene_CharacterSelect);
};

})();
