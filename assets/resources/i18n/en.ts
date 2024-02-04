
const win = window as any;

export const languages = {
  "Play":"Play",
  "Score":"Score",
  "Pause":"Pause",
  "Your_record":"Your record",
  "GAME_OVER":"GAME OVER",
  "Loading":"Loading...",
  "Sound":"Sound",
  "Music":"Music",
  "tutor_1":"Swipe and release"

};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
