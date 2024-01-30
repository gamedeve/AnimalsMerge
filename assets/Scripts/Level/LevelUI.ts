import {
  _decorator,
  Component,
  Node,
  EventTarget,
  Label,
  game,
  ToggleComponent,
} from "cc";
import { LevelController } from "./LevelController";
import { GameData } from "db://assets/Core/Scripts/GameData";
import { GameEventManager } from "db://assets/Core/Scripts/GameEventManager";
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();
@ccclass("LevelUI")
export class LevelUI extends Component {
  @property(Node)
  startPanel: Node | null = null;

  @property(Node)
  losePanel: Node | null = null;

  @property(Node)
  pausePanel: Node | null = null;

  @property(Node)
  gamePanel: Node | null = null;

  @property(Label)
  private scoreText: Label | null = null;

  @property(Label)
  private gameOverScoreText: Label | null = null;
  @property(Label)
  private pauseScoreText: Label | null = null;
  @property(Label)
  private recordScoreText: Label | null = null;
  @property(ToggleComponent)
  private soundToggle: ToggleComponent | null = null;
  @property(ToggleComponent)
  private musicToggle: ToggleComponent | null = null;

  onLoad() {
    console.log("Check data");
    console.log(GameData.Instance?.inited);
    if (GameData.Instance?.inited) {
      this.loadSettings();
    }
  }

  loadSettings() {
    if (GameData.Instance?.saver.saveData) {
      //  console.log("GameData.Instance?.Saver?.SaveData?.score",GameData.Instance?.Saver?.SaveData?.score)

      if (this.soundToggle) {
        // console.log("SetSound", GameData.Instance?.saver.saveData.sound);
        this.soundToggle.isChecked = GameData.Instance?.saver.saveData.sound;
      }
      if (this.musicToggle) {
        this.musicToggle.isChecked = GameData.Instance?.saver.saveData.music;
      }
    }
  }
  onEnable() {
    GameEventManager.Instance?.node.on(GameEventManager.EventType.ON_GAME_INITED, this.loadSettings, this);
    LevelController.Instance?.node.on(
      "scoreUpdated",
      this.scoreUpdatedHandler,
      this
    );
    LevelController.Instance?.node.on(
      "recordUpdated",
      this.recordUpdatedHandler,
      this
    );
    LevelController.Instance?.node.on(
      "levelInited",
      this.levelInitedHandler,
      this
    );

    this.soundToggle?.node.on("toggle", this.callbackSoundSettings, this);
    this.musicToggle?.node.on("toggle", this.callbackMusicSettings, this);
  }

  onDisable() {
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.ON_GAME_INITED,
      this.loadSettings,
      this
    );

    // game.off('scoreUpdated', this.scoreUpdatedHandler, this);
    // eventTarget.off('scoreUpdated', this.scoreUpdatedHandler, this);
    LevelController.Instance?.node.off(
      "scoreUpdated",
      this.scoreUpdatedHandler,
      this
    );
    LevelController.Instance?.node.off(
      "recordUpdated",
      this.recordUpdatedHandler,
      this
    );
    LevelController.Instance?.node.off(
      "levelInited",
      this.levelInitedHandler,
      this
    );
    this.soundToggle?.node.off("toggle", this.callbackSoundSettings, this);
    this.musicToggle?.node.off("toggle", this.callbackMusicSettings, this);
  }

  start() {
    this.closeAllPanels();
    this.scoreUpdatedHandler(0);
  }

  levelInitedHandler() {
    this.SetActivePanel(this.startPanel, true);
  }

  scoreUpdatedHandler(score: number) {
    // console.log("ScoreUpdated", score);

    if (this.scoreText) {
      this.scoreText.string = score.toString();
    }

    if (this.pauseScoreText) {
      this.pauseScoreText.string = score.toString();
    }

    if (this.gameOverScoreText) {
      this.gameOverScoreText.string = score.toString();
    }
  }
  recordUpdatedHandler(score: number) {
    if (this.recordScoreText) {
      this.recordScoreText.string = score.toString();
    }
  }

  public openPause(): void {
    LevelController.Instance?.setPause(true);
    this.closeAllPanels();
    this.SetActivePanel(this.pausePanel, true);
  }
  public closePause(): void {
    LevelController.Instance?.setPause(false);
    this.closeAllPanels();
    this.SetActivePanel(this.gamePanel, true);
  }

  public startLevel() {
    this.SetActivePanel(this.startPanel, false);
    this.SetActivePanel(this.gamePanel, true);
    LevelController.Instance?.startLevel();
  }
  public restartLevel() {
    LevelController.Instance?.restartLevel();
  }

  private closeAllPanels(): void {
    this.SetActivePanel(this.pausePanel, false);
    this.SetActivePanel(this.gamePanel, false);
    this.SetActivePanel(this.losePanel, false);
    this.SetActivePanel(this.startPanel, false);
  }

  private gameOver(): void {
    this.SetActivePanel(this.gamePanel, false);
    this.SetActivePanel(this.losePanel, false);
  }

  // Sounds Setting
  callbackSoundSettings(toggle: ToggleComponent) {
    console.log("callbackSoundSettings");
    console.log(toggle);
    console.log(toggle.isChecked);
    GameData.Instance?.saver.setSound(toggle.isChecked);
    GameEventManager.Instance?.sendOnSoundSettingsUpdate(toggle.isChecked);
    GameData.Instance?.saver.save();
    // The callback parameter is the Toggle component, note that events registered this way cannot pass customEventData.
  }
  callbackMusicSettings(toggle: ToggleComponent) {
    console.log("MusicSettings");
    console.log(toggle);
    console.log(toggle.isChecked);
    GameData.Instance?.saver.setMusic(toggle.isChecked);
    GameEventManager.Instance?.sendOnMusicSettingsUpdate(toggle.isChecked);
    GameData.Instance?.saver.save();
    // The callback parameter is the Toggle component, note that events registered this way cannot pass customEventData.
  }

  private SetActivePanel(panel: Node | null, val: boolean): void {
    if (panel) {
      panel.active = val;
    }
  }
}
