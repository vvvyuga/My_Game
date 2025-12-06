/*:
 * @target MZ
 * @plugindesc Полное отключение уровней, EXP и всех отображений (меню, бой, статус, HUD)
 * @author You
 */

// ----------------------------
// ОТКЛЮЧАЕМ ПОЛУЧЕНИЕ ОПЫТА
// ----------------------------
Game_Actor.prototype.gainExp = function() {
    // опыт полностью отключён
};

Game_Actor.prototype.expForNextLevel = function() {
    return Infinity;
};

Game_Actor.prototype.currentExp = function() {
    return 0;
};

Game_Actor.prototype.currentLevelExp = function() {
    return 0;
};

Game_Actor.prototype.nextLevelExp = function() {
    return Infinity;
};

// ----------------------------
// ОТКЛЮЧАЕМ РОСТ УРОВНЯ
// ----------------------------
Game_Actor.prototype.changeExp = function() {
    // блокируем любые попытки изменить уровень
};

// ----------------------------
// УБИРАЕМ ВИЗУАЛ УРОВНЯ И EXP ВО ВСЕХ ОКНАХ
// ----------------------------
Window_StatusBase.prototype.drawExpGauge = function() {};
Window_StatusBase.prototype.drawActorExp = function() {};
Window_StatusBase.prototype.drawActorLevel = function() {};
Window_Base.prototype.drawActorLevel = function() {};
Window_Base.prototype.drawActorExp = function() {};

// ----------------------------
// УБИРАЕМ EXP В ПОБЕДЕ В БОЮ
// ----------------------------
BattleManager.gainExp = function() {
    // после боя опыт не начисляется вообще
};

// ----------------------------
// ФИКС ТЕКСТА "LEVEL" В МЕНЮ
// ----------------------------
TextManager.level = function() {
    return "";
};
