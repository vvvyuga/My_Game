/*:
 * @target MZ
 * @plugindesc Белый туман, следующий за игроком, как «обратная тьма».
 * @author Pavel
 *
 * @param PictureName
 * @text Имя картинки тумана
 * @type file
 * @dir img/pictures/
 * @default light_fog
 *
 * @param Opacity
 * @text Прозрачность
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param Scale
 * @text Масштаб
 * @type number
 * @min 0.1
 * @max 5
 * @decimals 1
 * @default 1.5
 *
 * @param BlendMode
 * @text Режим смешивания
 * @type select
 * @option Normal
 * @value 0
 * @option Additive
 * @value 1
 * @option Multiply
 * @value 2
 * @option Screen
 * @value 3
 * @default 1
 */

(() => {
    const params = PluginManager.parameters("WhiteFogFollower");
    const picName = String(params.PictureName || "light_fog");
    const opacity = Number(params.Opacity || 128);
    const scale = Number(params.Scale || 1.5);
    const blend = Number(params.BlendMode || 1);

    let picId = 100; // ID картинки для тумана

    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        $gameScreen.showPicture(picId, picName, 0, $gamePlayer.screenX(), $gamePlayer.screenY(), scale * 100, scale * 100, opacity, blend);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if ($gameScreen.picture(picId)) {
            const x = $gamePlayer.screenX();
            const y = $gamePlayer.screenY();
            $gameScreen.movePicture(picId, 0, x, y, scale * 100, scale * 100, opacity, blend, 0);
        }
    };
})();
