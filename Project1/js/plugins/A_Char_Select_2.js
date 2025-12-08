/*:
 * @target MZ
 * @plugindesc FINAL Character Select FIXED (No disappear bug)
 *
 * @param BackgroundImage
 * @type file
 * @dir img/pictures
 * @default Panel_BG
 */

(() => {

const BG = String(PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]).BackgroundImage || "").trim();

const characters = [
 { name:"Osmond", klass:"Scout", bio:"Independent assassin from Gyorn. Kills for principles, not money.", smallPortrait:"portrait1_small", largePortrait:"portrait1_large", actorId:1 },
 { name:"Patricia", klass:"Renegade", bio:"Former high-ranking officer of Abundhord, now a fugitive.", smallPortrait:"portrait2_small", largePortrait:"portrait2_large", actorId:2 },
 { name:"Devor", klass:"Brute", bio:"Mutant melee fighter adapted to underground survival.", smallPortrait:"portrait3_small", largePortrait:"portrait3_large", actorId:3 }
];

class Scene_CharacterSelect extends Scene_MenuBase {

 create() {
  super.create();
  this._index = 0;
  this.createBackground();
  this.createSmallPortraits();
  this.createLargePortrait();
  this.createInfoWindow();
  this.updateSelection();
 }

 createBackground() {
  if (BG) {
   this._bg = new Sprite(ImageManager.loadPicture(BG));
   this.addChildAt(this._bg, 0); // ✅ ВСЕГДА ВНИЗУ
  }
 }

 createSmallPortraits() {
  this._smallPortraits = [];
  const baseX = 300;
  const baseY = 90;
  const spacing = 140;

  characters.forEach((ch, i) => {
   const s = new Sprite(ImageManager.loadPicture(ch.smallPortrait));
   s.x = baseX + i * spacing;
   s.y = baseY;
   s.anchor.set(0.5);
   s.opacity = 120;
   this.addChild(s);
   this._smallPortraits.push(s);
  });
 }

 createLargePortrait() {
  this._largePortrait = new Sprite();
  this._largePortrait.x = Graphics.width - 260;
  this._largePortrait.y = Graphics.height / 2;
  this._largePortrait.anchor.set(0.5);
  this._largePortrait.opacity = 0;
  this.addChild(this._largePortrait);
 }

 createInfoWindow() {
  const w = 340;
  const h = 300;
  const x = 60;
  const y = 210;
  this._infoWindow = new Window_Base(new Rectangle(x, y, w, h));
  this._infoWindow.openness = 255; // ✅ ПРИНУДИТЕЛЬНО ВИДИМО
  this.addChild(this._infoWindow);
 }

 update() {
  super.update();
  this.updateMouse();

  if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
   this.selectCharacter();
  }
 }

 updateMouse() {
  const mx = TouchInput.x;
  const my = TouchInput.y;

  this._smallPortraits.forEach((s, i) => {
   if (
    mx > s.x - 64 && mx < s.x + 64 &&
    my > s.y - 64 && my < s.y + 64
   ) {
    if (this._index !== i) {
     this._index = i;
     this.updateSelection();
    }
   }
  });
 }

 updateSelection() {
  const ch = characters[this._index];

  this._smallPortraits.forEach((s, i) => {
   s.opacity = (i === this._index) ? 255 : 120;
  });

  this._largePortrait.bitmap = ImageManager.loadPicture(ch.largePortrait);
  this._largePortrait.opacity = 0;

  const w = this._infoWindow;
  w.contents.clear();

  let y = 0;
  w.drawText(ch.name, 0, y, w.contents.width); y += 32;
  w.drawText(ch.klass, 0, y, w.contents.width); y += 32;
  w.drawText("----------------", 0, y, w.contents.width); y += 20;

  this.drawWrappedText(w, ch.bio, 0, y);
 }

 drawWrappedText(win, text, x, y) {
  const max = win.contents.width;
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
   const test = line + words[i] + " ";
   if (win.contents.measureTextWidth(test) > max) {
    win.drawText(line, x, y, max);
    line = words[i] + " ";
    y += 24;
   } else {
    line = test;
   }
  }

  win.drawText(line, x, y, max);
 }

 selectCharacter() {
  const ch = characters[this._index];
  $gameParty._actors = [];
  $gameParty.addActor(ch.actorId);
  SceneManager.goto(Scene_Map);
 }
}

// ✅ ПЕРЕХВАТ NEW GAME
const _newGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
 _newGame.call(this);
 SceneManager.push(Scene_CharacterSelect);
};

})();
