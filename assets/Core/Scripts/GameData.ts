import { _decorator, Component, Node, director, game } from "cc";
const { ccclass, property } = _decorator;
import { Saver } from "db://assets/Core/Scripts/Saver";
import { GameEventManager } from "./GameEventManager";
@ccclass("GameData")
export class GameData extends Component {
  public static Instance: GameData | null = null;

  public saver: Saver = new Saver();

  public inited: boolean = false;

  onLoad(): void {
    GameData.Instance = this;
    director.addPersistRootNode(this.node);
  }

  protected start(): void {
    this.initGame();
  }

  private initGame(): void {
    window.addEventListener("blur", () => {
      this.gamePause(true);
    });
    window.addEventListener("focus", () => {
      this.gamePause(false);
    });

    this.saver.load();

    GameEventManager.Instance?.sendOnGameInited();
    this.inited = true;
  }

  private gamePause(val: boolean) {
    console.log("Game Pause", val);
    val ? game.pause() : game.resume();
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
