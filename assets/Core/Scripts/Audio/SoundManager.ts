import {
  _decorator,
  Component,
  Node,
  director,
  AudioSource,
  AudioClip,
} from "cc";
const { ccclass, property } = _decorator;
import { GameEventManager } from "db://assets/Core/Scripts/GameEventManager";
import { GameData } from "db://assets/Core/Scripts/GameData";

@ccclass("SoundManager")
export class SoundManager extends Component {
  public static Instance: SoundManager | null = null;

  private audioSource: AudioSource | null = null;
  @property(AudioClip)
  private mergeSound: AudioClip | null = null;

  private musicEnabled: boolean = true;
  private soundEnabled: boolean = true;

  onLoad() {
    SoundManager.Instance = this;
    director.addPersistRootNode(this.node);
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
      GameEventManager.EventType.ON_SOUND_SETTINGS_UPDATE,
      this.onSoundSettingsUpdateCallback,
      this
    );
    GameEventManager.Instance?.node.on(
      GameEventManager.EventType.ON_MUSIC_SETTINGS_UPDATE,
      this.onMusicSettingsUpdateCallback,
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
      GameEventManager.EventType.ON_SOUND_SETTINGS_UPDATE,
      this.onSoundSettingsUpdateCallback,
      this
    );
    GameEventManager.Instance?.node.off(
      GameEventManager.EventType.ON_MUSIC_SETTINGS_UPDATE,
      this.onMusicSettingsUpdateCallback,
      this
    );
  }

  loadSettings() {
    if (GameData.Instance?.saver.saveData) {
      this.musicEnabled = GameData.Instance?.saver.saveData.music;
      this.soundEnabled = GameData.Instance?.saver.saveData.sound;
    }
  }

  public playMergeSound() {
    if (this.mergeSound) {
      this.playOneShot(this.mergeSound);
    }
  }

  public playOneShot(audioClip: AudioClip) {
    if (this.soundEnabled) {
      this.audioSource?.playOneShot(audioClip);
    }
  }

  private onSoundSettingsUpdateCallback(val:boolean){
    this.soundEnabled = val;
  }
  private onMusicSettingsUpdateCallback(val:boolean){
    this.musicEnabled = val;
  }
}
