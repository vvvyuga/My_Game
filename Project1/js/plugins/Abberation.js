/*:
 * @target MZ
 * @plugindesc Chromatic Aberration only on map and battle visuals, menu unaffected
 * @param RedShift
 * @text Red Channel Shift
 * @default 2
 * @param GreenShift
 * @text Green Channel Shift
 * @default -1
 * @param BlueShift
 * @text Blue Channel Shift
 * @default 1
 * @param Intensity
 * @text Intensity
 * @default 0.5
 * @help
 * Applies chromatic aberration only to the map and battle layers, not to menus or windows.
 */

(() => {
    const parameters = PluginManager.parameters('ChromaticAberrationMapOnly');
    const RED_SHIFT   = Number(parameters['RedShift'] || 2);
    const GREEN_SHIFT = Number(parameters['GreenShift'] || -1);
    const BLUE_SHIFT  = Number(parameters['BlueShift'] || 1);
    const INTENSITY   = Number(parameters['Intensity'] || 0.5);

    // === Для сцены карты ===
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);

        this._chromatic = new PIXI.filters.RGBSplitFilter();
        this._chromatic.red   = new PIXI.Point(RED_SHIFT * INTENSITY, 0);
        this._chromatic.green = new PIXI.Point(GREEN_SHIFT * INTENSITY, 0);
        this._chromatic.blue  = new PIXI.Point(BLUE_SHIFT * INTENSITY, 0);

        // Применяем фильтр только к контейнеру карты
        this._baseSprite.filters = [this._chromatic];
    };

    // === Для сцены боя ===
    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _Spriteset_Battle_createLowerLayer.call(this);

        this._chromatic = new PIXI.filters.RGBSplitFilter();
        this._chromatic.red   = new PIXI.Point(RED_SHIFT * INTENSITY, 0);
        this._chromatic.green = new PIXI.Point(GREEN_SHIFT * INTENSITY, 0);
        this._chromatic.blue  = new PIXI.Point(BLUE_SHIFT * INTENSITY, 0);

        // Применяем фильтр только к контейнеру боя
        this._battleField.filters = [this._chromatic];
    };
})();
