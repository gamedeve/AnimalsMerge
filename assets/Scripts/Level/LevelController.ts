import {
  _decorator,
  Component,
  Node,
  Prefab,
  director,
  instantiate,
  input,
  Input,
  EventTouch,
  EventMouse,
  v3,
  v2,
  Vec2,
  Vec3,
  Sprite,
  SpriteFrame,
  view,
  game,
  EventTarget,
  UITransform,
  AudioSource,
} from "cc";

import { MergeItem } from "./MergeItem";
import { Utils } from "db://assets/Core/Scripts/Utils/Utils";
import { GameEventManager } from "db://assets/Core/Scripts/GameEventManager";
import { SoundManager } from "../../Core/Scripts/Audio/SoundManager";
// import { example, ExampleEventType } from "db://assets/Core/Scripts/EvenManager";
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();

@ccclass("LevelController")
export class LevelController extends Component {
  public static Instance: LevelController | null = null;

  @property(Node)
  touchPanel: Node | null = null;

  @property(Node)
  cursor: Node | null = null;

  @property([Prefab])
  itemsList: Prefab[] = [];
  // @property([SpriteFrame])
  // itemsSpriteList: SpriteFrame[] = [];

  @property(Node)
  private parentNode: Node | null = null;

  // @property({ type: Node })
  // private parentShowNext: Node | null = null;

  @property(Node)
  private itemPos: Node | null = null;



  public Score: number = 0;
  public IsPause: boolean = false;

  private itemsGravity: number = 5;//гравитация для айтемов

  private minLenght: number = 2; // Минимальное значение
  private maxLenght: number = 5; // Минимальное значение
  private nextIndex: number = 0;
  
  private itemFly: boolean = false;

  private currentMergeItem: MergeItem | null = null;


  

  onLoad() {
    LevelController.Instance = this;

    this.touchPanel?.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    this.touchPanel?.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.touchPanel?.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    // example.on(ExampleEventType.STATE_CHANGED, this.SCH, this);


    // eventTarget.on('scoreUpdated', this.ScoreUpdatedHandler, this);
  }

  private SCH(){

  }
  // ScoreUpdatedHandler(score: number) {
  //   console.log("ScoreUpdatedLvl", score);

  // }

  onDestroy() {
    this.touchPanel?.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    this.touchPanel?.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.touchPanel?.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
  }

  protected start(): void {
    // console.log("STArtSTARTSTART")
    this.InitLevel();
  }

  private InitLevel(): void {
    //Создать первый объект
   
    // console.log(this.itemPos?.getPosition());
    // console.log(this.itemPos?.getWorldPosition());
   
    this.CreateNextMergeItem();
    
  }


  private getItemStartPos(){
    let point: Vec3 = this.itemPos?.getWorldPosition() as unknown as null || Vec3.ZERO;
    point.x -= view.getVisibleSize().width / 2;
    point.y -= view.getVisibleSize().height / 2;

    return point;
  }


  onTouchEnd(event: EventTouch) {
    
    //Блокируем нажатие если item все еще летит
    if(this.itemFly){
      return;
    }

    this.itemFly = true;

    let x = event.getUILocation().x - view.getVisibleSize().width / 2;
    this.MoveCursor(v3(x, this.cursor?.position.y || 0, 0));

    //Запускаем предыдущий Итем
    this.currentMergeItem?.StartFly(this.itemsGravity);
    this.scheduleOnce(() => {
      this.itemFly = false;
    }, 0.75);
    //Получаем новый индекс
    this.nextIndex = Utils.randomInteger(0, this.minLenght - 1);

    //Создаем след item
    this.CreateNextMergeItem();

    // let point: Vec2 = event.getUILocation();
    // point.x -= view.getVisibleSize().width / 2;
    // // point.y = view.getVisibleSize().height / 2 - 170;
    // point.y = (this.itemPos?.getWorldPosition().y || 200) - view.getVisibleSize().height / 2;


   
  }

  onMouseMove(event: EventMouse) {

    let x = event.getUILocationX() - view.getVisibleSize().width / 2;
    this.MoveCursor(v3(x, this.cursor?.position.y || 0, 0));
  }

  onTouchMove(event: EventTouch) {
    let x = event.getUILocation().x - view.getVisibleSize().width / 2;
    this.MoveCursor(v3(x, this.cursor?.position.y || 0, 0));
    
  }

  private MoveCursor(pos:Vec3){
    // 
    this.cursor?.setPosition(pos);
    this.currentMergeItem?.node.setPosition(this.getItemStartPos());
  }

 

  public ItemsMerged(index: number, pos: Vec3): void {
    let newIndex: number = index + 1;

    if (newIndex < this.itemsList.length) {
      this.CreateItem(newIndex, pos);
    }

    if (
      newIndex + 1 > this.minLenght &&
      newIndex + 1 <= this.itemsList.length
    ) {
      this.minLenght = Math.min(newIndex + 1, this.maxLenght);
      
    }
    this.AddScoreByIndex(index);
    SoundManager.Instance?.PlayMergeSound();
  }

  
  //Созданеие следущего Item
  private CreateNextMergeItem(): void{
    let newNode: Node | null = this.CreateItem(this.nextIndex, this.getItemStartPos());
    this.currentMergeItem = newNode?.getComponent(MergeItem) as MergeItem;
    this.currentMergeItem?.SetActive(false);
  }

  //Создание префаба по индексу
  private GetMergeItemByIndex(index: number): Prefab {
    // let index = Utils.randomInteger(0, this.itemsList.length-1);
    if (index >= this.itemsList.length) {
      index = 0;
    }
    return this.itemsList[index];
  }


  //Создание префаба
  private CreateItem(index: number, pos: Vec3): Node | null {
    if (index >= this.itemsList.length) {
      return null;
    }

    let node: Node = instantiate(
      this.GetMergeItemByIndex(index)
    ) as unknown as Node;

    node.parent = this.parentNode;
    //node.parent = scene;;
    node.setPosition(pos);

   

    return node;
    // console.log("TEST",Utils.randomInteger(0, 2));
  }


  private AddScoreByIndex(index: number) {
    this.Score += index + 1;
    // console.log("oldscore", this.Score);
    // eventTarget.emit('scoreUpdated',  this.Score);
    this.node.emit("scoreUpdated", this.Score);
  }


  public SetPause(val: boolean): void {
    this.IsPause = val;
    if(val){
      director.pause();
    }
    else{
      director.resume();
    }

    GameEventManager.Instance?.SendOnPause(val);
    
  }



  update(deltaTime: number) {}
}
