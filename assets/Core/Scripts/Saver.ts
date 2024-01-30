import { sys } from "cc";

export class Saver {
  public saveData = {
    sound: true,
    music: true,
    score: 0,
  };

  public setScore(val: number) {
    this.saveData.score = val;
  }

  public setSound(val: boolean) {
    this.saveData.sound = val;
  }

  public setMusic(val: boolean) {
    this.saveData.music = val;
  }

  public save() {
    sys.localStorage.setItem("saveData", JSON.stringify(this.saveData));
  }

  public load(): void {
    let data = sys.localStorage.getItem("saveData");
    if (data) {
      this.saveData = JSON.parse(data);
    }
  }
}
