import {
  _decorator,
  Component,
  Node,
  RigidBody2D,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
} from "cc";
const { ccclass, property } = _decorator;
import { MergeItem } from "./MergeItem";
import { LevelController } from "./LevelController";
@ccclass("DeadLine")
export class DeadLine extends Component {
  private rb: RigidBody2D | null = null;
  private collider: Collider2D | null = null;
  private deadPos: number = 0;
  onLoad() {
    this.rb = this.node.getComponent(RigidBody2D);
    this.collider = this.node.getComponent(Collider2D) as Collider2D;

    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    this.deadPos = this.node.getWorldPosition().y;

    console.log("Dead pos", this.deadPos);
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    let otherMergeItem: MergeItem | null = null;
    otherMergeItem = otherCollider.node.getComponent(MergeItem);
    // console.log(otherMergeItem)
    if (otherMergeItem && !otherMergeItem.itemFly) {
      // this.getItemsUnderLine();
      LevelController.Instance?.startDeadTimer();
    }
  }


  public getItemsUnderLine(): number {
    let count:number = 0;
    console.log("resultArr ALLLLLLL", LevelController.Instance?.parentNode?.children?.length);
    const resultArr = LevelController.Instance?.parentNode?.children.filter(
      (node) => {

        let mergeItem: MergeItem | null = node.getComponent(MergeItem);
        
        return node.getWorldPosition().y > this.deadPos && mergeItem?.Active && !mergeItem?.itemFly;
        
      }
    );
    console.log("resultArr", resultArr?.length);

    count = resultArr?.length ? resultArr?.length : 0;
    return count;
  }
}
