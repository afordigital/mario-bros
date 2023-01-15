const uuid = require('uuid')

const EVENTS = {
  LOGGED: 'logged',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  MOVEMENT: 'movement'
}

// TODO: move model to other side
class Character {
  constructor (id, name) {
    this.id = id
    this.name = name
  }
}

class Socket {
  constructor (deps, socket) {
    this._id = uuid.v4()
    this._deps = deps
    this._socket = socket
    this._unsubscribeCallbacks = []
  }

  async configureBroadcast () {
    for (const event of Object.values(EVENTS)) {
      this._unsubscribeCallbacks.push(
        await this._deps.bus.subscribe(event, payload => {
          if (payload && payload.character && payload.character.id) {
            if (payload.character.id !== this._character.id) {
              this._send(event, payload)
            }
          } else {
            this._send(event, payload)
          }
        })
      )
      console.debug(`Subscribed to ${event}`)
    }
  }

  async start () {
    let buff = []
    let connected = false

    // Clean up all events when socket is closed.
    this._socket.on('close', () => this.destroy())

    // Listen messages and enqueue if not ready
    this._socket.on('message', msg => {
      if (!connected) {
        return buff.push(msg)
      }
      this.routing(msg)
    })

    // Configure broadcast channels before process any message
    await this.configureBroadcast()

    // We're ready! Begin process messages
    connected = true
    for (const msg of buff) {
      this.routing(msg)
    }
    buff = []
  }

  routing (buff) {
    try {
      const { type, payload } = JSON.parse(buff.toString())
      console.log('Message received', type, payload)
      switch (type) {
        case 'login':
          this._onLogin(payload)
          break
        case 'movement':
          this._onMovement(payload)
          break
      }
    } catch {}
  }

  async _onLogin (payload) {
    console.log('Payload', payload)
    const char = new Character(this.id, payload.name)
    await this._deps.repos.charactersConnected.addCharacter(char)
    this._send(EVENTS.LOGGED, { character: this._character })
    this._deps.bus.publish(EVENTS.CONNECTED, { character: this._character })
    const chars =
      await this._deps.repos.charactersConnected.retrieveCharacters()
    for (const char of Object.values(chars)) {
      const ch = JSON.parse(char)
      if (ch) {
        this._send(EVENTS.CONNECTED, { character: ch })
      }
    }
  }

  _send (event, payload) {
    this._socket.send(JSON.stringify({ event, payload }))
  }

  destroy () {
    this._socket.removeAllListeners()
  }

  async _onMovement (payload) {
    this._deps.bus.publish(EVENTS.MOVEMENT, {
      character: this._character,
      movement: payload
    })
  }
}

module.exports = {
  Socket
}
