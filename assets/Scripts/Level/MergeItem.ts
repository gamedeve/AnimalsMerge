import {
  _decorator,
  Component,
  Node,
  Collider2D,
  IPhysics2DContact,
  Contact2DType,
  RigidBody2D,
  v2,
  Vec2,
  Vec3,
  view,
  Sprite,
  SpriteFrame,
  UITransform,
} from "cc";
const { ccclass, property } = _decorator;
import { Utils } from "db://assets/Core/Scripts/Utils/Utils";
import { LevelController } from "./LevelController";

@ccclass("MergeItem")
export class MergeItem extends Component {
  @property
  public Index: number = 0;
  public Active: boolean = true;
  public itemFly: boolean = false;

  private transform: UITransform | null = null;
  private rb: RigidBody2D | null = null;
  private collider: Collider2D | null = null;
  private MergeItem: MergeItem | null = null;

  onLoad() {
    this.rb = this.node.getComponent(RigidBody2D);
    this.transform = this.node.getComponent(UITransform);
    this.MergeItem = this.node.getComponent(MergeItem);
    this.collider = this.node.getComponent(Collider2D) as Collider2D;
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  public SetNewIndex(): void {
    // console.log("otherMergeItem", this.Index)
    // this.Active = false;
    this.SetActive(false);
    this.scheduleOnce(() => {
      this.node.destroy();
      LevelController.Instance?.itemsMerged(this.Index, this.GetPosInCanvas());
    }, 0);
  }

  public SetPos(pos: Vec3) {
    this.node.setPosition(pos);
  }

  //Запускаем падение
  public StartFly(gravity:number){
    this.SetActive(true);
    this.RandomRotate();
    this.SetGravity(gravity);
    this.itemFly = true;
  }

  public SetGravity(val: number): void {
    // this.rb?.applyForceToCenter(force, true);
    if (this.rb) {
      this.rb.gravityScale = val;
    }
  }

  public RandomRotate() {
    this.rb?.applyAngularImpulse(Utils.randomInteger(-15, 15), true);
  }

  private GetPosInCanvas(): Vec3 {
    // return v2(this.node.position.x - view.getVisibleSize().width / 2, this.node.position.y - view.getVisibleSize().height / 2);
    // return v2(this.node.position.x, this.node.position.y);
    return this.node.position;
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {

    
    // will be called once when two colliders begin to contact

    let otherMergeItem: MergeItem | null = null;
    otherMergeItem = otherCollider.node.getComponent(MergeItem);
    // console.log(otherMergeItem?.Index);
// console.log(otherCollider.group);
    if(this.itemFly && (otherCollider.tag == 10 || otherMergeItem)){
      this.itemFly = false;
    }
    
    if (
      this.MergeItem &&
      otherMergeItem &&
      otherMergeItem.Index === this.MergeItem.Index &&
      otherMergeItem.Active
    ) {
      this.Active = false;
      // console.log(otherMergeItem?.Index);

      this.scheduleOnce(() => {
        otherMergeItem?.SetNewIndex();

        this.SetActive(false);
        this.node.destroy();
      }, 0);
    }
  }

  public GetImageSprite(): SpriteFrame | null {
    let SpriteFrame: SpriteFrame | null = null;
    let imageChild: Node = this.node.getChildByName("Image") as unknown as Node;
    if (imageChild) {
      SpriteFrame = imageChild.getComponent(Sprite)
        ?.spriteFrame as unknown as SpriteFrame;
    }

    return SpriteFrame;
  }

  public SetActive(val: boolean): void {
    this.Active = val;
    if (this.rb) {
      this.rb.enabled = val;
    }

    if (this.collider) {
      this.collider.enabled = val;
    }
  }
}
