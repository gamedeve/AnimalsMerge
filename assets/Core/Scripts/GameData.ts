declare const bridge: any;
import * as i18n from "db://i18n/LanguageData";
import { _decorator, Component, Node, director, game } from "cc";
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
    GameData.Instance = this;
    director.addPersistRootNode(this.node);
  }

  protected start(): void {
    bridge
      ?.initialize()
      .then(() => {
        console.log(
          "Инициализация прошла успешно, можно использовать SDK 22222222222"
        );
        i18n.init(bridge.platform.language);
        this.initGame();
      })
      .catch((error: any) => {
        console.log(error, "// Ошибка, что-то пошло не так 2222222222");
      });
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

    // bridge.game.on(bridge.EVENT_NAME.VISIBILITY_STATE_CHANGED, (state: any) => {
    //   if (state === "hidden") {
    //     console.log("Отключаем звук VISIBILITY_STATE_CHANGED");
    //     this.gamePause(true);
    //   } else if (state === "visible") {
    //     console.log("Включаем звук VISIBILITY_STATE_CHANGED");
    //     this.gamePause(false);
    //   }
    //   console.log("Visibility state:", state);
    // });

    // bridge.advertisement.interstitialState
    //// Отслеживать изменение состояния можно подписавшись на событие
    bridge.advertisement.on(
      bridge.EVENT_NAME.INTERSTITIAL_STATE_CHANGED,
      (state: any) => {
        if (state === "loading") {
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
        if (state === "loading") {
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
    ;
    if(val){
      game.pause();
      console.log("Game Pause", true);
    } else if(!val && !this.adsShow){
      game.resume();
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
