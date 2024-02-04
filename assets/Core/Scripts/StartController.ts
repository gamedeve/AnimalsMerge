import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;
import { SceneLoader } from "db://assets/Core/Scripts/SceneLoader";
import { GameData } from "db://assets/Core/Scripts/GameData";
import { GameEventManager } from "db://assets/Core/Scripts/GameEventManager";
@ccclass("StartController")
export class StartController extends Component {
  start() {
    if (GameData.Instance?.inited) {
      this.loadSettings();
    }
  }

  onEnable() {
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.GAME_INITED,
      this.loadSettings,
      this
    );
  }

  onDisable() {
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.GAME_INITED,
      this.loadSettings,
      this
    );
  }

  loadSettings() {
    SceneLoader.Instance?.LoadScene("Main");
  }
}
