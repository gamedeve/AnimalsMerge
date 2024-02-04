declare const bridge: any;
// import { } from 'cc';

export class Leaderboard {
  public setScore(score: number): void {

    if(!bridge.leaderboard.isSetScoreSupported){
      return;
    }
    
    let setScoreOptions = {
      yandex: {
        leaderboardName: "best",
        score: score,
      },
    };


    bridge.leaderboard
      .setScore(setScoreOptions)
      .then(() => {
        // Очки успешно записаны
        console.log("Очки успешно записаны");
      })
      .catch((error: any) => {
        console.log("Ошибка записи в лидерборд");
        console.log(error);
      });
  }
}
