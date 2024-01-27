import { _decorator, Component, Node, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
import { GameEventManager } from "db://assets/Core/Scripts/GameEventManager";
@ccclass('AudioSourceControl')
export class AudioSourceControl extends Component {

  private audioSource:AudioSource | null = null;
  onLoad(){
    this.audioSource = this.node.getComponent(AudioSource);
  }
  onEnable() {
    GameEventManager.Instance?.node.on('onPause', this.onPauseCallback, this);
  }

  onDisable() {
    GameEventManager.Instance?.node.on('onPause', this.onPauseCallback, this);
  }


  private onPauseCallback(val:boolean):void{
    console.log("onPauseCallback", val)
    val ? this.audioSource?.pause() : this.audioSource?.play();
  }
}


