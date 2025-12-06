/*:
 * @target MZ
 * @plugindesc Кастомная камера: плавная, с фокусом на игрока/событиях и поддержкой зума
 * @author Pavel
 *
 * @param CamDelayVar
 * @text Переменная дилея камеры
 * @desc ID переменной, которая регулирует дилей камеры. 0 — использовать дефолт
 * @type variable
 * @default 0
 *
 * @param DefaultDelay
 * @text Дефолтный дилей
 * @desc Значение дилея, если переменная не используется
 * @type number
 * @default 15
 *
 * @param ZoomScaleVar
 * @text Переменная масштаба зума
 * @desc ID переменной для управления зумом. 0 — использовать 1
 * @type variable
 * @default 0
 *
 * @param DefaultZoom
 * @text Дефолтный зум
 * @desc Масштаб по умолчанию
 * @type number
 * @default 1
 *
 * @param ZoomSpeed
 * @text Скорость зума
 * @desc Чем выше, тем медленнее изменение масштаба
 * @type number
 * @default 12
 */

(() => {
    const params = PluginManager.parameters("CustomCameraMZ");
    const defaultDelay = Number(params.DefaultDelay || 15);
    const camVarId = Number(params.CamDelayVar || 0);
    const zoomVarId = Number(params.ZoomScaleVar || 0);
    const defaultZoom = Number(params.DefaultZoom || 1);
    const zoomSpeed = Number(params.ZoomSpeed || 12);

    // Целевая позиция камеры и масштаб
    Game_Map.prototype.initCustomCamera = function() {
        if (!this._camX) this._camX = 0;
        if (!this._camY) this._camY = 0;
        if (!this._camZoom) this._camZoom = defaultZoom;
        if (!this._camTarget) this._camTarget = $gamePlayer;
    };

    // Фокус камеры на объекте или координатах
    Game_Map.prototype.setCameraTarget = function(target) {
        this._camTarget = target || $gamePlayer;
    };

    Game_Map.prototype.setCameraZoom = function(scale) {
        this._camZoomTarget = scale;
    };

    const _Game_Map_updateScroll = Game_Map.prototype.updateScroll;
    Game_Map.prototype.updateScroll = function() {
        this.initCustomCamera();
        if (!this._camTarget) return _Game_Map_updateScroll.call(this);

        // Определяем цель в пикселях
        let targetPX, targetPY;
        if (this._camTarget._realX !== undefined) {
            // Если цель — игрок или событие
            targetPX = this._camTarget._realX * this.tileWidth() + this.tileWidth()/2;
            targetPY = this._camTarget._realY * this.tileHeight() + this.tileHeight()/2;
        } else {
            // Если цель — объект с координатами x,y
            targetPX = this._camTarget.x;
            targetPY = this._camTarget.y;
        }

        const halfScreenW = Graphics.width / 2;
        const halfScreenH = Graphics.height / 2;
        let goalX = targetPX - halfScreenW;
        let goalY = targetPY - halfScreenH;

        // Ограничение по границам карты
        const maxPX = Math.max(0, this.width() * this.tileWidth() - Graphics.width);
        const maxPY = Math.max(0, this.height() * this.tileHeight() - Graphics.height);
        goalX = Math.max(0, Math.min(goalX, maxPX));
        goalY = Math.max(0, Math.min(goalY, maxPY));

        // Получаем текущий дилей
        const delay = camVarId > 0 ? Math.max(1, $gameVariables.value(camVarId)) : defaultDelay;

        // Плавное смещение камеры
        this._camX += (goalX - this._camX) / delay;
        this._camY += (goalY - this._camY) / delay;

        this._displayX = this._camX / this.tileWidth();
        this._displayY = this._camY / this.tileHeight();

        // Плавный зум
        const targetZoom = zoomVarId > 0 ? $gameVariables.value(zoomVarId) : (this._camZoomTarget || defaultZoom);
        if (!this._camZoom) this._camZoom = targetZoom;
        this._camZoom += (targetZoom - this._camZoom) / zoomSpeed;

        // Применяем масштаб
        $gameScreen.setZoom(this._camZoom, this._camZoom, Graphics.width/2, Graphics.height/2);
    };

    // Плагин команды для фокуса
    PluginManager.registerCommand("CustomCameraMZ", "FocusPlayer", args => {
        $gameMap.setCameraTarget($gamePlayer);
    });

    PluginManager.registerCommand("CustomCameraMZ", "FocusEvent", args => {
        const id = Number(args.eventId || 1);
        const ev = $gameMap.event(id);
        if (ev) $gameMap.setCameraTarget(ev);
    });

    PluginManager.registerCommand("CustomCameraMZ", "FocusXY", args => {
        const x = Number(args.x || 0) * $gameMap.tileWidth();
        const y = Number(args.y || 0) * $gameMap.tileHeight();
        $gameMap.setCameraTarget({x: x, y: y});
    });

    PluginManager.registerCommand("CustomCameraMZ", "SetZoom", args => {
        const scale = Number(args.scale || defaultZoom);
        $gameMap.setCameraZoom(scale);
    });

})();
