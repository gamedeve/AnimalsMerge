declare const bridge: any;
// import { } from 'cc';

export class Ads {

  public init() {
    // // bridge.advertisement.interstitialState
    // //// Отслеживать изменение состояния можно подписавшись на событие
    // bridge.advertisement.on(
    //   bridge.EVENT_NAME.INTERSTITIAL_STATE_CHANGED,
    //   (state: any) => {
    //     console.log("Interstitial state: ", state);
    //   }
    // );

    // // bridge.advertisement.rewardedState

    // // Отслеживать изменение состояния можно подписавшись на событие
    // bridge.advertisement.on(
    //   bridge.EVENT_NAME.REWARDED_STATE_CHANGED,
    //   (state: any) => {
    //     console.log("Rewarded state: ", state);
    //   }
    // );
  }

  public showInterstitial(): void {
    bridge.advertisement.showInterstitial();
  }

  public showRewarded(): void {
    bridge.advertisement.showRewarded();
  }
}
