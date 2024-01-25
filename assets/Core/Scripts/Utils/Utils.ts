// import { _decorator, Component, Node } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('Utils')
export class Utils {
  
    public static randomInteger(min:number, max:number):number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}



