import { _decorator, Component, Node, director, game } from 'cc';

const { ccclass, property } = _decorator;


@ccclass('GameEventManager')
export class GameEventManager extends Component {
  public static Instance: GameEventManager | null = null;
  onLoad(): void {
    GameEventManager.Instance = this;
    director.addPersistRootNode(this.node);
  }
  
 
  public SendOnPause(val:boolean) : void
  {
    this.node.emit("onPause", val);
  }
}


