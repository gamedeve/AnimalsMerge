import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { SceneLoader } from "../../Core/Scripts/SceneLoader";
@ccclass('StartController')
export class StartController extends Component {


  start() {
    SceneLoader.Instance?.LoadScene("Main");
  
  }


    
}


