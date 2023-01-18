import * as events from 'events'

interface User {
  name: string
}

export class MessageController extends events.EventEmitter {
  constructor (private _ws: WebSocket) {
    super()
  }

  routing (message: string) {
    const m = JSON.parse(message)

    this.emit(m.event, m.payload)
  }

  movement(movement: any) {
    this._send('movement', movement);
  }

  private _send<T> (type: string, payload: T) {
    this._ws.send(
      JSON.stringify({
        type,
        payload
      })
    )
  }

  login (name: string) {
    this._send('login', { name })
  }
}
