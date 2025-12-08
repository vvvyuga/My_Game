/*:
 * @target MZ
 * @plugindesc Full Character Select Screen with mouse, animation, wrapped bio, background, up to 6 characters
 *
 * @param InfoWindowX
 * @default 40
 * @param InfoWindowY
 * @default 260
 * @param InfoWindowW
 * @default 420
 * @param InfoWindowH
 * @default 260
 *
 * @param BustX
 * @default 980
 * @param BustY
 * @default 360
 *
 * @param PortraitStartX
 * @default 240
 * @param PortraitY
 * @default 90
 * @param PortraitSpacing
 * @default 140
 *
 * @param SmallScale
 * @default 1.0
 * @param LargeScale
 * @default 1.0
 *
 * @param UnselectedOpacity
 * @default 120
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

  const characters = [
    {
      name: "Osmond",
      klass: "Scout",
      bio: "Independent assassin from Gyorn.\nKills for principles, not money.\n\nSkilled with tracking and daggers.",
      small: "portrait1_small",
      large: "portrait1_large",
      actorId: 1
    },
    {
      name: "Patricia",
      klass: "Renegade",
      bio: "Former Abundhord official.\nNow a fugitive.\n\nManipulates people with ease.",
      small: "portrait2_small",
      large: "portrait2_large",
      actorId: 2
    },
    {
      name: "Devor",
      klass: "Mutant",
      bio: "Strong melee fighter.\nHardened by the mines.\n\nHates authority.",
      small: "portrait3_small",
      large: "portrait3_large",
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

      this.createBackground();
      this.createPortraits();
      this.createBust();
      this.createInfo();
      this.updateSelection();
    }

    createBackground() {
      this._bg = new Sprite(ImageManager.loadPicture("Panel_BG"));
      this.addChild(this._bg);
    }

    createPortraits() {
      this._portraits = [];

      characters.forEach((ch, i) => {
        const sp = new Sprite(ImageManager.loadPicture(ch.small));
        sp.x = CFG.portX + CFG.spacing * i;
        sp.y = CFG.portY;
        sp.anchor.set(0.5);
        sp.scale.set(CFG.smallScale);
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

    createInfo() {
      this._info = new Window_Base(
        new Rectangle(CFG.infoX, CFG.infoY, CFG.infoW, CFG.infoH)
      );
      this._info.opacity = 255;
      this.addChild(this._info);
    }

    update() {
      super.update();

      if (Input.isRepeated("right")) this.changeIndex(1);
      if (Input.isRepeated("left")) this.changeIndex(-1);
      if (Input.isTriggered("ok")) this.select();
      
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

      if (TouchInput.isTriggered()) this.select();
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

      const text =
`${ch.name}
${ch.klass}

${ch.bio}`;

      this.drawFormattedText(this._info, text, 0, 0);
    }

    drawFormattedText(win, text, x, y) {
      const lines = text.split("\n");
      const maxWidth = win.contents.width;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === "") {
          y += 28;
          continue;
        }

        const words = lines[i].split(" ");
        let buffer = "";

        for (let w = 0; w < words.length; w++) {
          const test = buffer + words[w] + " ";
          if (win.contents.measureTextWidth(test) > maxWidth) {
            win.drawText(buffer, x, y, maxWidth);
            buffer = words[w] + " ";
            y += 28;
          } else buffer = test;
        }

        win.drawText(buffer, x, y, maxWidth);
        y += 28;
      }
    }

    select() {
      const ch = characters[this._index];
      $gameParty._actors = [];
      $gameParty.addActor(ch.actorId);
      SceneManager.goto(Scene_Map);
    }
  }

  const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
  Scene_Title.prototype.commandNewGame = function () {
    _Scene_Title_commandNewGame.call(this);
    SceneManager.push(Scene_CharacterSelect);
  };
window.testCharacterSelect = function() {
  SceneManager.goto(Scene_CharacterSelect);
};

})();