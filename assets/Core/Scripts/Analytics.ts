declare const bridge: any;
// import { _decorator, Component, Node } from 'cc';

export class Analytics {
    
  private gameReadySended:boolean = false;

    public gameReady():void{
      
      if(this.gameReadySended){
        return;
      }

      this.gameReadySended = true;
      bridge.platform.sendMessage('game_ready');

    }

    public startLevel():void{

    }
    public endLevel():void{

    }
}


