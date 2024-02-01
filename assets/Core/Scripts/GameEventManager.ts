import { _decorator, Component, Node, director, game } from 'cc';

const { ccclass, property } = _decorator;

enum GameEventType
{
	SOUND_SETTINGS_UPDATE = 'SoundSettingsUpdate',
	MUSIC_SETTINGS_UPDATE = 'MusicSettingsUpdate',
	PAUSE = 'Pause',
	GAME_INITED = 'GameInited',
}

@ccclass('GameEventManager')
export class GameEventManager extends Component {
  public static Instance: GameEventManager | null = null;
 
  public static readonly EventType = GameEventType;

  onLoad(): void {
    GameEventManager.Instance = this;
    director.addPersistRootNode(this.node);
  }
  
 
  public sendOnPause(val:boolean) : void
  {
    this.node.emit(GameEventManager.EventType.PAUSE, val);
  }

  public sendOnGameInited() : void
  {
    this.node.emit(GameEventManager.EventType.GAME_INITED);
  }

  public sendOnSoundSettingsUpdate(val:boolean) : void
  {
    this.node.emit(GameEventManager.EventType.SOUND_SETTINGS_UPDATE, val);
  }
  
  public sendOnMusicSettingsUpdate(val:boolean) : void
  {
    this.node.emit(GameEventManager.EventType.MUSIC_SETTINGS_UPDATE, val);
  }
}


