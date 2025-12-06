/*:
 * @target MZ
 * @plugindesc Белый туман вокруг игрока, под интерфейсом, с настраиваемым радиусом обзора и затухания
 * @author Pavel
 *
 * @param FogColor
 * @text Цвет тумана
 * @default rgba(255,255,255,0.8)
 *
 * @param ClearRadius
 * @text Радиус чистой зоны (тайлы)
 * @type number
 * @default 3
 *
 * @param FadeRadius
 * @text Радиус плавного затухания (тайлы)
 * @type number
 * @default 6
 */

(() => {

    const params = PluginManager.parameters("WhiteFogUI");
    const fogColor = String(params.FogColor || "rgba(255,255,255,0.8)");
    const clearRadius = Number(params.ClearRadius || 3);
    const fadeRadius = Number(params.FadeRadius || 6);

    // ------------------------------
    // Добавляем туман в Spriteset_Map
    // ------------------------------
    const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map_initialize.call(this);

        this._fogBitmap = new Bitmap(Graphics.width, Graphics.height);
        this._fogSprite = new Sprite(this._fogBitmap);
        this._fogSprite.z = 9; // над спрайтами карты, под окнами UI
        this.addChild(this._fogSprite);
    };

    // ------------------------------
    // Обновление тумана каждый кадр
    // ------------------------------
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (this._spriteset && this._spriteset._fogSprite) {
            updateFog(this._spriteset._fogSprite, this._spriteset._fogBitmap);
        }
    };

    function updateFog(fogSprite, fogBitmap) {
        fogBitmap.clear();

        const tileSize = $gameMap.tileWidth();
        const playerX = $gamePlayer.screenX();
        const playerY = $gamePlayer.screenY();

        const radiusPx = clearRadius * tileSize;
        const fadePx = fadeRadius * tileSize;
        const totalRadius = radiusPx + fadePx;

        const ctx = fogBitmap._context;
        const gradient = ctx.createRadialGradient(playerX, playerY, radiusPx, playerX, playerY, totalRadius);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, fogColor);

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, Graphics.width, Graphics.height);
        ctx.restore();
    }

})();
