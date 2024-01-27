import { _decorator, Component, Node,director, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
  public static Instance: SoundManager | null = null;


  private audioSource:AudioSource | null = null;
  @property(AudioClip)
  private mergeSound:AudioClip | null = null;
  

  onLoad(){
    SoundManager.Instance = this;
    director.addPersistRootNode(this.node);
    this.audioSource = this.node.getComponent(AudioSource);
  }

  public PlayMergeSound(){
    if(this.mergeSound){
    this.PlayOneShot(this.mergeSound);
    }
  }

  public PlayOneShot(audioClip:AudioClip){
    this.audioSource?.playOneShot(audioClip);
  }
}


