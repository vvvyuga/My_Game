/*:
 * @target MZ
 * @plugindesc Плавная камера за игроком без рывков. Дилей настраивается через переменную.
 * @author Pavel
 *
 * @param CamDelayVar
 * @text Переменная дилея камеры
 * @desc ID переменной, в которой хранится значение дилея камеры. 0 — использовать дефолт
 * @type variable
 * @default 0
 *
 * @param DefaultDelay
 * @text Дефолтное значение дилея
 * @desc Значение дилея, если переменная не используется
 * @type number
 * @default 15
 */

(() => {

    const params = PluginManager.parameters("CameraSmoothVar");
    const defaultDelay = Number(params.DefaultDelay || 15);
    const camVarId = Number(params.CamDelayVar || 0);

    const _Game_Map_updateScroll = Game_Map.prototype.updateScroll;
    Game_Map.prototype.updateScroll = function() {
        if (!$gamePlayer) return _Game_Map_updateScroll.call(this);

        // Пиксельные координаты игрока
        const playerPX = $gamePlayer._realX * this.tileWidth() + this.tileWidth()/2;
        const playerPY = $gamePlayer._realY * this.tileHeight() + this.tileHeight()/2;

        // Центр экрана
        const halfScreenW = Graphics.width / 2;
        const halfScreenH = Graphics.height / 2;

        // Цель камеры в пикселях
        let targetPX = playerPX - halfScreenW;
        let targetPY = playerPY - halfScreenH;

        // Ограничение по границам карты
        const maxPX = Math.max(0, this.width() * this.tileWidth() - Graphics.width);
        const maxPY = Math.max(0, this.height() * this.tileHeight() - Graphics.height);
        targetPX = Math.max(0, Math.min(targetPX, maxPX));
        targetPY = Math.max(0, Math.min(targetPY, maxPY));

        // Получаем текущий дилей из переменной или используем дефолт
        const delay = camVarId > 0 ? Math.max(1, $gameVariables.value(camVarId)) : defaultDelay;

        // Инициализация камеры при первом кадре
        if (!this._cameraX) this._cameraX = targetPX;
        if (!this._cameraY) this._cameraY = targetPY;

        // Плавное смещение камеры
        this._cameraX += (targetPX - this._cameraX) / delay;
        this._cameraY += (targetPY - this._cameraY) / delay;

        // Преобразуем обратно в тайлы для рендера
        this._displayX = this._cameraX / this.tileWidth();
        this._displayY = this._cameraY / this.tileHeight();
    };

})();
