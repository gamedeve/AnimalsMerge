import { _decorator, Component, Node, EventTarget, Label, game } from "cc";
import { LevelController } from "./LevelController";
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();
@ccclass("LevelUI")
export class LevelUI extends Component {

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



  onEnable() {
    console.log("LevelUI LevelUI");
    // eventTarget.on('scoreUpdated', this.ScoreUpdatedHandler, this);
    LevelController.Instance?.node.on('scoreUpdated', this.ScoreUpdatedHandler, this);
  }

  onDisable() {
    // game.off('scoreUpdated', this.ScoreUpdatedHandler, this);
    // eventTarget.off('scoreUpdated', this.ScoreUpdatedHandler, this);
    LevelController.Instance?.node.off('scoreUpdated', this.ScoreUpdatedHandler, this);
  }

  start(){
    this.ScoreUpdatedHandler(0);
  }

  ScoreUpdatedHandler(score: number) {
    // console.log("ScoreUpdated", score);

    if(this.scoreText){
      this.scoreText.string = score.toString();
    }

    if(this.gameOverScoreText){
      this.gameOverScoreText.string = score.toString();
    }
  }

  public OpenPause(): void{
    LevelController.Instance?.SetPause(true);
    this.CloseAllPanels();
    this.SetActivePanel(this.pausePanel, true);
  }
  public ClosePause(): void{
    LevelController.Instance?.SetPause(false);
    this.CloseAllPanels();
    this.SetActivePanel(this.gamePanel, true);
  }


  private CloseAllPanels():void{
    this.SetActivePanel(this.pausePanel, false);
    this.SetActivePanel(this.gamePanel, false);
  }

  private GameOver():void{
    this.SetActivePanel(this.gamePanel, false);
    this.SetActivePanel(this.losePanel, false);
  }
  

  private SetActivePanel(panel:Node | null, val:boolean):void{
    if(panel){
      panel.active = val;
    }
  }
}
