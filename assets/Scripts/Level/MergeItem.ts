import { _decorator, Component, Node, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, v2, Vec2, view, Sprite, SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;
import {Utils} from 'db://assets/Core/Scripts/Utils/Utils';
import { LevelController } from './LevelController';
@ccclass('MergeItem')
export class MergeItem extends Component {

    @property
    public Index: number = 0;
    public Active: boolean = true;
    
    private rb: RigidBody2D | null = null;
    private collider: Collider2D | null = null;
    private MergeItem: MergeItem | null = null;

    onLoad() {
      this.rb = this.node.getComponent(RigidBody2D);
      this.MergeItem = this.node.getComponent(MergeItem);
      this.collider = this.node.getComponent(Collider2D) as Collider2D;
      //console.log(collider);
      //collider?.on('onCollisionEnter', this.onCollisionEnter, this);

      this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    public SetNewIndex(): void{
      // console.log("otherMergeItem", this.Index)
      // this.Active = false;
      this.SetActive(false);
      this.scheduleOnce(() => {
        this.node.destroy();
        LevelController.Instance?.ItemsMerged(this.Index, this.GetPosInCanvas());
       }, 0);
    }

    private GetPosInCanvas():Vec2 {
      // return v2(this.node.position.x - view.getVisibleSize().width / 2, this.node.position.y - view.getVisibleSize().height / 2);
      return v2(this.node.position.x, this.node.position.y);
    }

    public RandomRotate(){
      this.rb?.applyAngularImpulse(Utils.randomInteger(-15,15), true);
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
      // will be called once when two colliders begin to contact
      //console.log('onBeginContact');

      let otherMergeItem: MergeItem | null = null;
      otherMergeItem = otherCollider.node.getComponent(MergeItem);
      // console.log(otherMergeItem?.Index);
      
      if(this.MergeItem && otherMergeItem 
        && otherMergeItem.Index === this.MergeItem.Index 
        && otherMergeItem.Active){


        this.Active = false;
        // console.log(otherMergeItem?.Index);
        
        this.scheduleOnce(() => {
          otherMergeItem?.SetNewIndex();

        // selfCollider.enabled = false;
        //  if(this.rb){
        //   this.rb.enabled = false;
        //  }

         this.SetActive(false);
          //console.log("Collider disabled");
          this.node.destroy();
         }, 0);
      }
      
  }

  public GetImageSprite(): SpriteFrame | null{
    let SpriteFrame: SpriteFrame | null = null;
    let imageChild:Node = this.node.getChildByName("Image") as unknown as Node;
    if(imageChild){
        SpriteFrame = imageChild.getComponent(Sprite)?.spriteFrame as unknown as SpriteFrame;
    }

    return SpriteFrame;
  }

  

  public SetActive(val:boolean): void{
    this.Active = val;
    if(this.rb){
      this.rb.enabled = val;
    }

    if(this.collider){
      this.collider.enabled = val;
     }
  }


}





