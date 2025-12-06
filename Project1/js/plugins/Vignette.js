/*:
 * @target MZ
 * @plugindesc Customizable vignette overlay for RPG Maker MZ
 * @param Color
 * @text Vignette Color
 * @desc Hex color of the vignette (default black)
 * @default #000000
 * @param Opacity
 * @text Vignette Opacity
 * @desc Maximum opacity (0-255)
 * @default 150
 * @param Radius
 * @text Gradient Radius
 * @desc How far from the center the vignette fades out
 * @default 300
 * @help
 * Adds a full-screen vignette effect with customizable color, opacity, and radius.
 */

(() => {

    const parameters = PluginManager.parameters('Vignette');
    const VIGNETTE_COLOR = parameters['Color'] || '#000000';
    const VIGNETTE_OPACITY = Number(parameters['Opacity'] || 150);
    const VIGNETTE_RADIUS = Number(parameters['Radius'] || 300);

    let _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        _Scene_Map_createSpriteset.call(this);
        createVignette.call(this);
    };

    function createVignette() {
        // Создаем спрайт поверх всего экрана
        this._vignetteSprite = new Sprite();
        const graphics = new PIXI.Graphics();

        // Полный экран
        graphics.beginFill(PIXI.utils.string2hex(VIGNETTE_COLOR), VIGNETTE_OPACITY / 255);
        graphics.drawRect(0, 0, Graphics.width, Graphics.height);
        graphics.endFill();

        // Создаем маску-круг
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff, 1);
        mask.drawCircle(Graphics.width/2, Graphics.height/2, VIGNETTE_RADIUS);
        mask.endFill();

        graphics.mask = mask;
        this._vignetteSprite.addChild(graphics);
        this.addChild(this._vignetteSprite);
    }

})();
