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

  protected start(): void {
    this.audioSource = this.node.getComponent(AudioSource);
    if (GameData.Instance?.inited) {
      this.loadSettings();
    }
  }

  onEnable() {
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.GAME_INITED,
      this.loadSettings,
      this
    );

    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.PAUSE,
      this.onPauseCallback,
      this
    );
   
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.MUSIC_SETTINGS_UPDATE,
      this.onMusicSettingsUpdateCallback,
      this
    );
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.SOUND_SETTINGS_UPDATE,
      this.onSoundSettingsUpdateCallback,
      this
    );
  }

  onDisable() {
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.GAME_INITED,
      this.loadSettings,
      this
    );

    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.PAUSE,
      this.onPauseCallback,
      this
    );
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.GAME_END,
      this.onGameEndCallback,
      this
    );
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.MUSIC_SETTINGS_UPDATE,
      this.onMusicSettingsUpdateCallback,
      this
    );
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.SOUND_SETTINGS_UPDATE,
      this.onSoundSettingsUpdateCallback,
      this
    );
  }

  loadSettings() {
    if (GameData.Instance?.saver.saveData) {
      this.musicEnabled = GameData.Instance?.saver.saveData.music;
      this.soundEnabled = GameData.Instance?.saver.saveData.sound;
      console.log("this.musicEnabled", this.musicEnabled)
      this.musicEnabled && !this.isPause ? this.audioSource?.play() : this.audioSource?.pause();
    }
  }
  private onPauseCallback(val: boolean): void {
    this.isPause = val;
    console.log("onPauseCallback", val);
    !val && this.musicEnabled
      ? this.audioSource?.play()
      : this.audioSource?.pause();
  }

  private onGameEndCallback(): void {
    this.audioSource?.pause();
  }

  private onMusicSettingsUpdateCallback(val: boolean) {
    this.musicEnabled = val;
    val && !this.isPause ? this.audioSource?.play() : this.audioSource?.pause();
  }

  private onSoundSettingsUpdateCallback(val:boolean){
    this.soundEnabled = val;
  }
}
