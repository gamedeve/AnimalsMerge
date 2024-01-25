import { _decorator, Component, Node, Prefab,
   director, instantiate, input, Input, EventTouch, EventMouse, v3, Vec2, Vec3, Sprite, SpriteFrame,
  view, game,
  EventTarget, UITransform} from 'cc';
import { MergeItem } from './MergeItem';
import {Utils} from 'db://assets/Core/Scripts/Utils/Utils';
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();

@ccclass('LevelController')
export class LevelController extends Component {
  public static Instance: LevelController | null = null;

  @property(Node)
  touchPanel: Node | null = null;

  @property(Node)
  cursor: Node | null = null;

  @property([Prefab])
  itemsList: Prefab[] = [];
  @property([SpriteFrame])
  itemsSpriteList: SpriteFrame[] = [];

  @property({type:Node})
  private parentNode: Node | null = null;

  @property({type:Node})
  private parentShowNext: Node | null = null;
  @property(Sprite)
  private nextItemSprite: Sprite | null = null;

  public Score:number = 0;
  public IsPause:boolean = false;


  private minLenght:number = 2;// Минимальное значение 
  private nextIndex:number = 0;

  onLoad () {
    LevelController.Instance = this;

    this.touchPanel?.on(Input.EventType.TOUCH_END, this.onTouchStart, this);
    this.touchPanel?.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.touchPanel?.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
   
    // eventTarget.on('scoreUpdated', this.ScoreUpdatedHandler, this);
  }
  // ScoreUpdatedHandler(score: number) {
  //   console.log("ScoreUpdatedLvl", score);
 
  // }

  onDestroy () {
    this.touchPanel?.off(Input.EventType.TOUCH_END, this.onTouchStart, this);
    this.touchPanel?.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.touchPanel?.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
  }

  protected start(): void {
    // console.log("STArtSTARTSTART")
    this.createCursorImage(this.nextIndex);
  }


  onTouchStart(event: EventTouch) {
    let point: Vec2 = event.getUILocation();
    point.x -= view.getVisibleSize().width / 2;
    // point.y -= view.getVisibleSize().height / 2;
    point.y = view.getVisibleSize().height/2 + -170;

    this.CreateItem(this.nextIndex, point);
    this.nextIndex = Utils.randomInteger(0, this.minLenght-1)
    this.createCursorImage(this.nextIndex);
  }

  onMouseMove(event: EventMouse){
    let x = event.getUILocationX()-view.getVisibleSize().width / 2;
    this.cursor?.setPosition(v3(x, this.cursor.position.y, 0));
  }
  onTouchMove(event: EventTouch){
    let x = event.getUILocation().x-view.getVisibleSize().width / 2;
    this.cursor?.setPosition(v3(x, this.cursor.position.y, 0));
  }

  private createCursorImage(index:number):void{
    if(index >= this.itemsList.length){
      return;
    }
    // if(this.parentShowNext){

    // this.parentShowNext?.removeAllChildren();
    // let child_node: Node = instantiate(this.GetMergeItemByIndex(index)) as unknown as Node;
    // child_node.parent = this.parentShowNext;
    
    // child_node.setPosition(Vec3.ZERO);
    // child_node.getComponent(MergeItem)?.SetActive(false);
    // // let parentTransform:UITransform = this.parentShowNext.getComponent(UITransform) as UITransform;
    // // let transform:UITransform = child_node.getComponent(UITransform) as UITransform;
    // // let scaleFactor = 1 / Math.max(transform.width / parentTransform.width, transform.height / parentTransform.height);
    // // child_node.setScale(v3(Math.min(scaleFactor, 1), Math.min(scaleFactor, 1), Math.min(scaleFactor, 1)));
    // // child_node.setScale(v3(0.5, 0.5, 0.5));
    
    // }
    if(this.nextItemSprite){
      this.nextItemSprite.spriteFrame = this.GetMergeItemSpriteFrameByIndex(index);
    }
   
  }

  


  public ItemsMerged(index:number, pos: Vec2): void {
    let newIndex: number = index + 1;
    if(newIndex < this.itemsList.length){
      this.CreateItem(newIndex, pos);
    }
    if(newIndex + 1 > this.minLenght && newIndex + 1 <= this.itemsList.length){
      this.minLenght = newIndex+1;
    }
    this.AddScoreByIndex(index);
  }

  private AddScoreByIndex(index:number){
    this.Score++;
    // console.log("oldscore", this.Score);
    // eventTarget.emit('scoreUpdated',  this.Score);
   this.node.emit('scoreUpdated',  this.Score);
  }

  CreateItem(index:number, pos: Vec2): void{
    if(index >= this.itemsList.length){
      return;
    }

    let node: Node = instantiate(this.GetMergeItemByIndex(index)) as unknown as Node;
    let scene = director.getScene();
    node.parent = this.parentNode;
    //node.parent = scene;;
    node.setPosition(v3(pos.x, pos.y, 0));
    node.getComponent(MergeItem)?.RandomRotate();
    // console.log("TEST",Utils.randomInteger(0, 2));
  }

  

  private GetMergeItemByIndex(index:number) : Prefab{
    // let index = Utils.randomInteger(0, this.itemsList.length-1);
    if(index >= this.itemsList.length){
      index = 0;
    }
    return this.itemsList[index];
  }

  private GetMergeItemSpriteFrameByIndex(index:number) : SpriteFrame{
    // let index = Utils.randomInteger(0, this.itemsList.length-1);
    if(index >= this.itemsSpriteList.length){
      index = 0;
    }
    return this.itemsSpriteList[index];
  }

  private GetRandomMergeItem() : Prefab{
    let index = Utils.randomInteger(0, this.itemsList.length-1);
    
    return this.GetMergeItemByIndex(index);
  }



  public SetPause(val:boolean):void{
    this.IsPause = val;
  }
  update(deltaTime: number) {
        
  }
}


