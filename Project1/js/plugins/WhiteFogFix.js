/*:
 * @target MZ
 * @plugindesc Белый туман вокруг игрока с радиусом чистого обзора и плавным затуханием, без дрейфа
 * @author Pavel
 *
 * @param FogColor
 * @text Цвет тумана
 * @default rgba(255,255,255,0.8)
 *
 * @param ClearRadius
 * @text Радиус чистого обзора (тайлы)
 * @type number
 * @default 3
 *
 * @param FadeRadius
 * @text Радиус затухания (тайлы)
 * @type number
 * @default 6
 */

(() => {
    const params = PluginManager.parameters("WhiteFogFixed");
    const fogColor = String(params.FogColor || "rgba(255,255,255,0.8)");
    const clearRadius = Number(params.ClearRadius || 3);
    const fadeRadius = Number(params.FadeRadius || 6);

    let _fogSprite = null;
    let _fogBitmap = null;
    let _fogContainer = null;

    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);

        // Контейнер для тумана под окнами UI
        _fogContainer = new Sprite();
        _fogContainer.z = 200; // под всеми окнами UI
        this.addChild(_fogContainer);

        _fogBitmap = new Bitmap(Graphics.width, Graphics.height);
        _fogSprite = new Sprite(_fogBitmap);
        _fogContainer.addChild(_fogSprite);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (_fogBitmap) {
            this._updateWhiteFog();
        }
    };

    Scene_Map.prototype._updateWhiteFog = function() {
        _fogBitmap.clear();

        const tileSize = $gameMap.tileWidth();
        const playerX = $gamePlayer.screenX();
        const playerY = $gamePlayer.screenY();

        const radiusPx = clearRadius * tileSize;
        const fadePx = fadeRadius * tileSize;
        const totalRadius = radiusPx + fadePx;

        const ctx = _fogBitmap._context;
        const gradient = ctx.createRadialGradient(playerX, playerY, radiusPx, playerX, playerY, totalRadius);
        gradient.addColorStop(0, 'rgba(255,255,255,0)'); // чистая зона
        gradient.addColorStop(1, fogColor);              // плавное затухание

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, Graphics.width, Graphics.height);
        ctx.restore();
    };
})();
