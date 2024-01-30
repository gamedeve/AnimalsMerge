import { _decorator, Component, Node, AudioSource } from "cc";
const { ccclass, property } = _decorator;
import { GameEventManager } from "db://assets/Core/Scripts/GameEventManager";
import { GameData } from "db://assets/Core/Scripts/GameData";

@ccclass("AudioSourceControl")
export class AudioSourceControl extends Component {
  private audioSource: AudioSource | null = null;
  private musicEnabled: boolean = true;
  private soundEnabled: boolean = true;
  private isPause: boolean = false;

  onLoad() {
    this.audioSource = this.node.getComponent(AudioSource);
    if (GameData.Instance?.inited) {
      this.loadSettings();
    }
  }

  onEnable() {
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.ON_GAME_INITED,
      this.loadSettings,
      this
    );

    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.ON_PAUSE,
      this.onPauseCallback,
      this
    );
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.ON_MUSIC_SETTINGS_UPDATE,
      this.onMusicSettingsUpdateCallback,
      this
    );
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.ON_SOUND_SETTINGS_UPDATE,
      this.onSoundSettingsUpdateCallback,
      this
    );
  }

  onDisable() {
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.ON_GAME_INITED,
      this.loadSettings,
      this
    );

    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.ON_PAUSE,
      this.onPauseCallback,
      this
    );
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.ON_MUSIC_SETTINGS_UPDATE,
      this.onMusicSettingsUpdateCallback,
      this
    );
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.ON_SOUND_SETTINGS_UPDATE,
      this.onSoundSettingsUpdateCallback,
      this
    );
  }

  loadSettings() {
    if (GameData.Instance?.saver.saveData) {
      this.musicEnabled = GameData.Instance?.saver.saveData.music;
      this.soundEnabled = GameData.Instance?.saver.saveData.sound;
    }
  }
  private onPauseCallback(val: boolean): void {
    this.isPause = val;
    console.log("onPauseCallback", val);
    !val && this.musicEnabled
      ? this.audioSource?.play()
      : this.audioSource?.pause();
  }

  private onMusicSettingsUpdateCallback(val: boolean) {
    this.musicEnabled = val;
    val && !this.isPause ? this.audioSource?.play() : this.audioSource?.pause();
  }

  private onSoundSettingsUpdateCallback(val:boolean){
    this.soundEnabled = val;
  }
}
