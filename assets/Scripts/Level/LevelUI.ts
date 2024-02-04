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
  loadPanel: Node | null = null;
  @property(Node)
  startPanel: Node | null = null;

  @property(Node)
  tutorPanel: Node | null = null;

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


  @property(Label)
  private DeadTimerNumber: Label | null = null;



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
    GameEventManager.Instance?.node.on(GameEventManager.EventType.GAME_INITED, this.loadSettings, this);
    LevelController.Instance?.node.on(
      LevelController.EventType.SCORE_UPDATED,
      this.scoreUpdatedHandler,
      this
    );
    LevelController.Instance?.node.on(
      LevelController.EventType.RECORD_UPDATED,
      this.recordUpdatedHandler,
      this
    );
    LevelController.Instance?.node.on(
      LevelController.EventType.LEVEL_INITED,
      this.levelInitedHandler,
      this
    );

    LevelController.Instance?.node.on(
      LevelController.EventType.SHOW_DEAD_TIMER,
      this.showDeadTimerPanel,
      this
    );
    LevelController.Instance?.node.on(
      LevelController.EventType.DEAD_TIMER,
      this.setDeadTimer,
      this
    );
    LevelController.Instance?.node.on(
      LevelController.EventType.LEVEL_END,
      this.gameEnd,
      this
    );

    this.soundToggle?.node.on("toggle", this.callbackSoundSettings, this);
    this.musicToggle?.node.on("toggle", this.callbackMusicSettings, this);
  }

  onDisable() {
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.GAME_INITED,
      this.loadSettings,
      this
    );

    // game.off('scoreUpdated', this.scoreUpdatedHandler, this);
    // eventTarget.off('scoreUpdated', this.scoreUpdatedHandler, this);
    LevelController.Instance?.node.off(
      LevelController.EventType.SCORE_UPDATED,
      this.scoreUpdatedHandler,
      this
    );
    LevelController.Instance?.node.off(
      LevelController.EventType.RECORD_UPDATED,
      this.recordUpdatedHandler,
      this
    );
    LevelController.Instance?.node.off(
      LevelController.EventType.LEVEL_INITED,
      this.levelInitedHandler,
      this
    );
    LevelController.Instance?.node.off(
      LevelController.EventType.SHOW_DEAD_TIMER,
      this.showDeadTimerPanel,
      this
    );
    LevelController.Instance?.node.off(
      LevelController.EventType.DEAD_TIMER,
      this.setDeadTimer,
      this
    );

    LevelController.Instance?.node.off(
      LevelController.EventType.LEVEL_END,
      this.gameEnd,
      this
    );
    this.soundToggle?.node.off("toggle", this.callbackSoundSettings, this);
    this.musicToggle?.node.off("toggle", this.callbackMusicSettings, this);
  }

  protected start(): void {
    console.log("Check data");
    console.log(GameData.Instance?.inited);
    this.closeAllPanels();
    this.scoreUpdatedHandler(0);
    this.SetActivePanel(this.loadPanel, true);
    
    if (GameData.Instance?.inited) {
      this.loadSettings();
    }
    
  }

  levelInitedHandler() {
    this.SetActivePanel(this.loadPanel, false);
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

    if(GameData.Instance?.saver.saveData.score == 0){
      this.showTutor();
    }
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

  private gameEnd(): void {
    this.SetActivePanel(this.gamePanel, false);
    this.SetActivePanel(this.losePanel, true);
  }

  showTutor(){
    this.SetActivePanel(this.tutorPanel, true);
  }

  closeTutor(){
    this.SetActivePanel(this.tutorPanel, false);
  }

  // Sounds Setting
  callbackSoundSettings(toggle: ToggleComponent) {
   
    GameData.Instance?.saver.setSound(toggle.isChecked);
    GameEventManager.Instance?.sendOnSoundSettingsUpdate(toggle.isChecked);
    GameData.Instance?.saver.save();
    // The callback parameter is the Toggle component, note that events registered this way cannot pass customEventData.
  }
  callbackMusicSettings(toggle: ToggleComponent) {

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


  private showDeadTimerPanel(val:boolean){
    if(this.DeadTimerNumber){
      this.SetActivePanel(this.DeadTimerNumber.node, val);
    }   
  }
  private setDeadTimer(val:number){
    if(this.DeadTimerNumber){
      this.DeadTimerNumber.string = (Math.floor(val)+1).toString();
    }   
  }




}
