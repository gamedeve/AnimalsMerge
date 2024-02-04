declare const bridge: any;
import { sys } from "cc";
import { resolve } from "path";

export class Saver {
  public saveData = {
    sound: true,
    music: true,
    score: 12,
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
    // sys.localStorage.setItem("saveData", JSON.stringify(this.saveData));

    // Сохранить данные по ключу
    bridge.storage
      // .set("saveData", JSON.stringify(this.saveData))
      .set("saveData", this.saveData)
      .then(() => {
        // Данные успешно сохранены
        console.log("Данные успешно сохранены");
      })
      .catch((error:any) => {
        console.log("Ошибка созранения данных");
        console.log(error);
      });
  }

  public load(): void {
    // let data = sys.localStorage.getItem("saveData");
    // if (data) {
    //   this.saveData = JSON.parse(data);
    // }

    bridge.storage
      .get("saveData")
      .then((data: any) => {
        console.log(data);
        if (data) {
          // if(Object.prototype.toString.call(data) === '[object String]'){
          //   this.saveData = JSON.parse(data);
          // }
          // else{
            this.saveData = data;
          // }
          
        }
        console.log("Данные загружены");
        console.log(this.saveData);
      })
      .catch((error: any) => {
        console.log("Ошибка загрузки данных");
        console.log(error);
      });
  }

  public async loadAsync(): Promise<void> {
    await bridge.storage
    .get("saveData")
    .then((data: any) => {
      if (data) {
        // if(Object.prototype.toString.call(data) === '[object String]'){
        //   this.saveData = JSON.parse(data);
        // }
        // else{
          this.saveData = data;
        // }
      }
      // resolve();
      console.log("Данные загружены");
      console.log(this.saveData);
    })
    .catch((error: any) => {
      console.log("Ошибка загрузки данных");
      console.log(error);
    });
  }
}
