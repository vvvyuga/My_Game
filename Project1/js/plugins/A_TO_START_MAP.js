/*:
 * @target MZ
 * @plugindesc Teleport player to custom map after name input (with plugin parameters)
 * @author You
 *
 * @param StartMapId
 * @text Start Map ID
 * @type number
 * @default 1
 *
 * @param StartX
 * @text Start X Position
 * @type number
 * @default 10
 *
 * @param StartY
 * @text Start Y Position
 * @type number
 * @default 10
 *
 * @param StartDirection
 * @text Start Direction
 * @type select
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 2
 *
 * @help
 * После подтверждения имени игрок автоматически переносится
 * на указанную карту в заданные координаты.
 * Всё настраивается через параметры плагина.
 */

(() => {

    const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);

    const TARGET_MAP_ID = Number(params.StartMapId || 1);
    const TARGET_X = Number(params.StartX || 10);
    const TARGET_Y = Number(params.StartY || 10);
    const TARGET_DIR = Number(params.StartDirection || 2);

    // ================================
    // ЖЁСТКИЙ ПЕРЕХВАТ ВВОДА ИМЕНИ
    // ================================

    const _Scene_Name_onInputOk = Scene_Name.prototype.onInputOk;

    Scene_Name.prototype.onInputOk = function() {

        // ✅ Стандартная логика RPG (применить имя)
        _Scene_Name_onInputOk.call(this);

        // ✅ Телепорт игрока
        $gamePlayer.reserveTransfer(
            TARGET_MAP_ID,
            TARGET_X,
            TARGET_Y,
            TARGET_DIR,
            0
        );

        // ✅ Принудительно запускаем игру, НЕ возвращаясь в меню
        SceneManager.goto(Scene_Map);
    };

})();
