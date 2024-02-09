import {
  _decorator,
  Component,
  Node,
  view,
  View,
  ResolutionPolicy,
  UITransform,
  Widget,
  screen,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("UIContainerResize")
export class UIContainerResize extends Component {
  // designWidth: number = 0;
  // designHeight: number = 0;
  // originalWidth: number = 1080;

  widget: Widget | null = null;
  // designHeight: number = 1080;

  // uiTransform: UITransform | null = null;
  protected onLoad(): void {
    // this.uiTransform = this.node.getComponent(UITransform);
    this.widget = this.node.getComponent(Widget);
  }

  protected start(): void {
    this.onResize();
  }
  onEnable() {
    // const dr = view.getDesignResolutionSize();
    // if (this.uiTransform) {
    //   this.originalWidth = this.uiTransform.contentSize.width;
    // }
    // this.designWidth = dr.width;
    // this.designHeight = dr.height;
    // console.log("this.designWidth", this.designWidth)
    // console.log("this.designHeight", this.designHeight)

    
    view.on("canvas-resize", this.onResize, this);
  }

  onDisable() {
    view.off("canvas-resize", this.onResize, this);
  }


  private onResize() {
    // console.log("this.designWidth", this.designWidth)
    // console.log("this.designHeight", this.designHeight)
    // const sr1 = view.getVisibleSize();
    let sr = screen.windowSize;
    // screen.windowSize;
    if (this.widget) {
      if (sr.width > sr.height) {
        this.widget.isAlignHorizontalCenter = true;
        this.widget.horizontalCenter = 0;
      } else {
        this.widget.isAlignRight = true;
        this.widget.isAlignLeft = true;
        this.widget.left = 0;
        this.widget.right = 0;
      }

      this.widget.updateAlignment();
    } 
    // console.log("this.getVisibleSize", sr1)
    // console.log("this.windowSize", sr)
    // console.log("this.uiTransform.contentSize.width", this.uiTransform?.contentSize.width)
    // const scale = this.designHeight / sr.height;

    // const vWidth = this.originalWidth * scale;
    // if(this.uiTransform){
    // this.uiTransform.setContentSize(vWidth, this.uiTransform?.contentSize.height);
    // console.log("this.uiTransform.contentSize.width", this.uiTransform?.contentSize.width)

    // }
    // const vHeight = sr.height * scale;
    // view.setDesignResolutionSize(vWidth, vHeight, ResolutionPolicy.SHOW_ALL);
  }
}
