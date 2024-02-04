declare const bridge: any;
import { _decorator, Component, Node, director, game } from 'cc';

const { ccclass, property } = _decorator;

enum GameEventType
{
	SOUND_SETTINGS_UPDATE = 'SOUND_SETTINGS_UPDATE',
	MUSIC_SETTINGS_UPDATE = 'MUSIC_SETTINGS_UPDATE',
	PAUSE = 'PAUSE',
	GAME_END = 'GAME_END',
	GAME_INITED = 'GAME_INITED',
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
  public sendOnGameEnd() : void
  {
    this.node.emit(GameEventManager.EventType.GAME_END);
  }
  public sendOnGameInited() : void
  {
    // bridge.game.on(bridge.EVENT_NAME.VISIBILITY_STATE_CHANGED, (state:any) => { 
    //   console.log('Visibility state:', state);
    // })
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


