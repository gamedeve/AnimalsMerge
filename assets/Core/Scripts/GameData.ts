import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData extends Component {
  public static Instance: GameData | null = null;
    onLoad(): void {
      GameData.Instance = this;
      director.addPersistRootNode(this.node);
    }

 
   
}


