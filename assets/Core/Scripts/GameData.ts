import { _decorator, Component, Node, director, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData extends Component {
  public static Instance: GameData | null = null;
    onLoad(): void {
      GameData.Instance = this;
      director.addPersistRootNode(this.node);
      window.addEventListener("blur", ()=>{

        this.gamePause(true);

      });
      window.addEventListener("focus", ()=>{

        this.gamePause(false);

      });
    }

    private gamePause(val:boolean){
      console.log("Game Pause", val);
      val ? game.pause() :  game.resume();
    }




    


  //   public setTimeScale(scale:number):void {
  //     director.calculateDeltaTime = function(now) {
  //       if (!now) now = performance.now();
  //       this._deltaTime = (now - this._lastUpdate) / 1000;
  //       this._deltaTime *= scale;
  //       this._lastUpdate = now;
  //     };
  // }
   
}






