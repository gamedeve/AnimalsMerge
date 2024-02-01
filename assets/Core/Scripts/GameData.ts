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


            // const url = new URL(window.location.href)
            // const yandexUrl = ['y', 'a', 'n', 'd', 'e', 'x', '.', 'n', 'e', 't'].join('')
            // if (url.hostname.includes(yandexUrl) || url.hash.includes('yandex')) {
            //     platformId = PLATFORM_ID.YANDEX
            // } else if (url.hostname.includes('crazygames.') || url.hostname.includes('1001juegos.com')) {
            //     platformId = PLATFORM_ID.CRAZY_GAMES
            // } else if (url.hostname.includes('gamedistribution.com')) {
            //     platformId = PLATFORM_ID.GAME_DISTRIBUTION
            // } else if (url.searchParams.has('api_id') && url.searchParams.has('viewer_id') && url.searchParams.has('auth_key')) {
            //     platformId = PLATFORM_ID.VK
            // } else if (url.searchParams.has('app_id') && url.searchParams.has('player_id') && url.searchParams.has('game_sid') && url.searchParams.has('auth_key')) {
            //     platformId = PLATFORM_ID.ABSOLUTE_GAMES
            // }



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
