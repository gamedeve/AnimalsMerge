declare const bridge: any;
import * as i18n from "db://i18n/LanguageData";
import { _decorator, Component, Node, director, game, Game } from "cc";
const { ccclass, property } = _decorator;
import { Saver } from "db://assets/Core/Scripts/Saver";
import { Ads } from "db://assets/Core/Scripts/Ads";
import { Leaderboard } from "db://assets/Core/Scripts/Leaderboard";
import { Analytics } from "db://assets/Core/Scripts/Analytics";
import { GameEventManager } from "./GameEventManager";
@ccclass("GameData")
export class GameData extends Component {
  public static Instance: GameData | null = null;

  public saver: Saver = new Saver();
  public ads: Ads = new Ads();
  public leaderboard: Leaderboard = new Leaderboard();
  public analytics: Analytics = new Analytics();

  public inited: boolean = false;
  public adsShow: boolean = false;
  onLoad(): void {

    
    if(GameData.Instance === null){
      GameData.Instance = this;
    }
    else{
      this.node.destroy();
      return;
    }
    // console.log("GameData onload")
    // GameData.Instance = this;
    director.addPersistRootNode(this.node);


    if(this.inited){
      return;
    }
    bridge
    ?.initialize()
    .then(() => {
      console.log(
        "Инициализация прошла успешно, можно использовать SDK 22222222222",  this.inited,GameData.Instance === this
      );
      i18n.init(bridge.platform.language);
      this.initGame();
    })
    .catch((error: any) => {
      console.log(error, "// Ошибка, что-то пошло не так 2222222222");
    });
  }

  // protected start(): void {
   
  // }

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
    // game.on(Game.EVENT_SHOW, function () {
    //   // do something
    // });
    window.addEventListener("blur", () => {
      this.gamePause(true);
      console.log("window blur");
    });
    window.addEventListener("focus", () => {
      this.gamePause(false);
      console.log("window focus");
    });

    bridge.game.on(bridge.EVENT_NAME.VISIBILITY_STATE_CHANGED, (state: any) => {
      if (state === "hidden") {
        // console.log("VISIBILITY_STATE_CHANGED hidden");
        // this.gamePause(true);
      } else if (state === "visible") {
        // console.log("VISIBILITY_STATE_CHANGED visible");
        this.gamePause(false);
        // bridge.window.focus();
      }
      console.log("VISIBILITY_STATE_CHANGED:", state);
    });

    // bridge.advertisement.interstitialState
    //// Отслеживать изменение состояния можно подписавшись на событие
    // globalThis
    bridge.advertisement.on(
      bridge.EVENT_NAME.INTERSTITIAL_STATE_CHANGED,
      (state: any) => {
        if (state === "opened") {
          console.log("Отключаем звук из-за рекламы");
          this.adsShow = true;
          this.gamePause(true);
        } else if (state === "closed" || state === "failed") {
          console.log("Включаем звук из-за рекламы");
          this.adsShow = false;
          this.gamePause(false);
        }
        console.log("Interstitial state: ", state);
      }
    );

    // bridge.advertisement.rewardedState

    // Отслеживать изменение состояния можно подписавшись на событие
    bridge.advertisement.on(
      bridge.EVENT_NAME.REWARDED_STATE_CHANGED,
      (state: any) => {
        if (state === "opened") {
          console.log("Отключаем звук из-за рекламы");
          this.adsShow = true;
          this.gamePause(true);
        } else if (state === "closed" || state === "failed") {
          console.log("Включаем звук из-за рекламы");
          this.adsShow = false;
          this.gamePause(false);
        }
        console.log("Rewarded state: ", state);
      }
    );

    this.ads.init();
    // this.saver.load();

    // this.saver.loadAsync()
    // GameEventManager.Instance?.sendOnGameInited();
    // this.inited = true;
    // console.log(this.saver.saveData)

    this.saver
      .loadAsync()
      .then(() => {
        this.inited = true;
        GameEventManager.Instance?.sendOnGameInited();
        // bridge.storage.delete('saveData');
        console.log(this.saver.saveData);
      })
      .catch((error) => console.log(error.message));
  }

  private gamePause(val: boolean) {
    
    if(val){
      game.pause();
      // director.pause();
      console.log("Game Pause", true);
    } else if(!val && !this.adsShow){
      
      game.resume();
      // director.resume();
      console.log("Game Pause", false);
    }
    // val ? game.pause() : game.resume();
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
