/*:
 * @target MZ
 * @plugindesc Подключает шрифт STIX2Text-Regular.otf, убирает обводку и добавляет настраиваемую тень
 * @author Pavel
 *
 * @param FontFile
 * @text Имя файла шрифта
 * @type file
 * @dir fonts/
 * @default STIX2Text-Regular.otf
 *
 * @param FontName
 * @text Имя шрифта в игре
 * @type string
 * @default STIX2Text
 *
 * @param ShadowColor
 * @text Цвет тени
 * @type string
 * @default rgba(0,0,0,0.5)
 *
 * @param ShadowBlur
 * @text Размытие тени
 * @type number
 * @default 4
 *
 * @param ShadowOffsetX
 * @text Смещение тени X
 * @type number
 * @default 2
 *
 * @param ShadowOffsetY
 * @text Смещение тени Y
 * @type number
 * @default 2
 */

(() => {
    const pluginName = "CustomSTIXFont";
    const params = PluginManager.parameters(pluginName);

    const fontFile = String(params.FontFile || "STIX2Text-Regular.otf");
    const fontName = String(params.FontName || "STIX2Text");

    const shadowColor = String(params.ShadowColor || "rgba(0,0,0,0.5)");
    const shadowBlur = Number(params.ShadowBlur || 4);
    const shadowOffsetX = Number(params.ShadowOffsetX || 2);
    const shadowOffsetY = Number(params.ShadowOffsetY || 2);

    // Загрузка шрифта
    const _loadGameFonts = FontManager.loadGameFonts;
    FontManager.loadGameFonts = function() {
        _loadGameFonts.call(this);
        this._states[fontName] = "loading";
        const url = "fonts/" + fontFile;
        Graphics.loadFont(fontName, url);
    };

    // Переопределяем drawText для настраиваемой тени
    const _Window_Base_drawText = Window_Base.prototype.drawText;
    Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
        const context = this.contents._context;
        context.save();
        context.shadowColor = shadowColor;
        context.shadowBlur = shadowBlur;
        context.shadowOffsetX = shadowOffsetX;
        context.shadowOffsetY = shadowOffsetY;
        _Window_Base_drawText.call(this, text, x, y, maxWidth, align);
        context.restore();
    };

    // Сбрасываем настройки шрифта и убираем стандартную обводку
    const _resetFontSettings = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _resetFontSettings.call(this);
        this.contents.outlineWidth = 0;
        this.contents.fontFace = fontName;
    };

})();
