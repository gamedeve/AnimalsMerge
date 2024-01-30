import { _decorator, Component, Node, director, game } from 'cc';

const { ccclass, property } = _decorator;

enum GameEventType
{
	ON_SOUND_SETTINGS_UPDATE = 'onSoundSettingsUpdate',
	ON_MUSIC_SETTINGS_UPDATE = 'onMusicSettingsUpdate',
	ON_PAUSE = 'onPause',
	ON_GAME_INITED = 'onGameInited',
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
    this.node.emit(GameEventManager.EventType.ON_PAUSE, val);
  }

  public sendOnGameInited() : void
  {
    this.node.emit(GameEventManager.EventType.ON_GAME_INITED);
  }

  public sendOnSoundSettingsUpdate(val:boolean) : void
  {
    this.node.emit(GameEventManager.EventType.ON_SOUND_SETTINGS_UPDATE, val);
  }
  
  public sendOnMusicSettingsUpdate(val:boolean) : void
  {
    this.node.emit(GameEventManager.EventType.ON_MUSIC_SETTINGS_UPDATE, val);
  }
}


