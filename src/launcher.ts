import { MessageController } from './messaging/Message'
import { Game } from './game'
import { GameConfig, WEBSOCKET_URL } from './config'
import { Player } from './models/character'


export class Launcher {
  private _connecting = false;
  private _connected = false;
  private _ws: WebSocket | null = null;
  private _mc: MessageController | null = null;
  private _selfPlayer: Player;
  protected _game: Game;
  constructor(public name: string, public isViewMode: boolean) {
    this.name = name;
  }

  start() {
    if (this._connecting) {
      // TODO: show warning
      return;
    }
    if (this._connected) {
      return;
    }
    this._connecting = true;
    this._ws = new WebSocket(WEBSOCKET_URL);
    this._mc = new MessageController(this._ws);
    this._ws.onopen = () => {
      this._connected = true;
      this._mc.login(this.name);
      
    };
    this._ws.onmessage = e => this._mc.routing(e.data);
    
    // TODO: Refactor
  
    this._mc.once('logged', (player: Player) => {
      this._selfPlayer = player;
      this._launchGame(this._selfPlayer);
    });
  }

  private _launchGame(selfPlayer: Player) {
    this._game = new Game(GameConfig, this.isViewMode, selfPlayer, this._mc);
  }
}
