import { MessageController } from './messaging/Message'
import { Game } from './game'
import { GameConfig } from './config'

export class Launcher {
  private _game: Game
  private _selfPlayer: any
  private _mc: MessageController
  constructor (public name: string) {
    this.name = name
  }

  start () {
    const ws = new WebSocket('ws://localhost:3333')
    this._mc = new MessageController(ws)
    ws.onopen = () => {
      this._mc.login(this.name)
    }
    ws.onmessage = e => this._mc.routing(e.data)
    this._mc.once('logged', player => {
      this._selfPlayer = player
      this._launchGame(this._selfPlayer)
    })
  }

  private _launchGame (selfPlayer: any) {
    this._game = new Game(GameConfig)
  }
}
