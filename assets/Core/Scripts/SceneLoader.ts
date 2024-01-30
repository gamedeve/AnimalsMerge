import { _decorator, Component, Node, director, ProgressBar } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SceneLoader")
export class SceneLoader extends Component {
  public static Instance: SceneLoader | null = null;

  @property(Node) private loadPanel: Node | null = null;
  @property(ProgressBar) private loadPb: ProgressBar | null = null;

  onLoad(): void {
    SceneLoader.Instance = this;
    director.addPersistRootNode(this.node);
    
    if (this.loadPanel) {
      this.loadPanel.active = false;
    }
  }

  public LoadScene(nameScene: string) {
    console.log("LoadScene", nameScene)
    if (this.loadPanel) {
      this.loadPanel.active = true;
    }
    director.preloadScene(nameScene, this.onProgressLoadScene, () => {
      director.loadScene(nameScene);
      if (this.loadPanel) {
        this.loadPanel.active = false;
      }
    });
  }

  private onProgressLoadScene = (
    completedCount: number,
    totalCount: number,
    item: any
  ) => {
    if (this.loadPb) {
      this.loadPb.progress = completedCount / totalCount;
    }
  };


}
