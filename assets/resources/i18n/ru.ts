
const win = window as any;

export const languages = {
  "Play":"Играть",
  "Score":"Очки",
  "Pause":"Пауза",
  "Your_record":"Ваш рекорд",
  "GAME_OVER":"КОНЕЦ",
  "Loading":"Загрузка...",
  "Sound":"Звук",
  "Music":"Музыка",
  "tutor_1":"Проведите и отпустите"
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ru = languages;
