/*:
 * @target MZ
 * @plugindesc Chromatic aberration effect on map and battle (requires Pixi Filters plugin) 
 * @param redShift
 * @text Red channel horizontal shift
 * @type number
 * @default 2
 * @param greenShift
 * @text Green channel horizontal shift
 * @type number
 * @default -2
 * @param blueShift
 * @text Blue channel horizontal shift
 * @type number
 * @default 2
 * @help
 * Requires a Pixi‑Filters plugin that defines RGBSplitFilter or similar.
 */

(() => {
    const params = PluginManager.parameters('ChromaticAberrationMZ');
    const RED_SHIFT   = Number(params.redShift);
    const GREEN_SHIFT = Number(params.greenShift);
    const BLUE_SHIFT  = Number(params.blueShift);

    // Проверка, есть ли фильтр
    function createRgbFilter() {
        // Например, библиотека может назвать фильтр RGBSplitFilter
        if (typeof PIXI.filters.RGBSplitFilter === 'function') {
            return new PIXI.filters.RGBSplitFilter();
        } else if (typeof PIXI.filters.ColorSplitFilter === 'function') {
            // Если другая реализация
            return new PIXI.filters.ColorSplitFilter();
        } else {
            console.warn('ChromaticAbberationMZ: no suitable Pixi filter found');
            return null;
        }
    }

    // Применить аберрацию на слой карты
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        const filter = createRgbFilter();
        if (filter) {
            filter.red = { x: RED_SHIFT, y: 0 };
            filter.green = { x: GREEN_SHIFT, y: 0 };
            filter.blue = { x: BLUE_SHIFT, y: 0 };
            this._baseSprite.filters = [filter];
        }
    };

    // Применить аберрацию на слой боя
    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _Spriteset_Battle_createLowerLayer.call(this);
        const filter = createRgbFilter();
        if (filter) {
            filter.red = { x: RED_SHIFT, y: 0 };
            filter.green = { x: GREEN_SHIFT, y: 0 };
            filter.blue = { x: BLUE_SHIFT, y: 0 };
            this._battleField.filters = [filter];
        }
    };
})();
