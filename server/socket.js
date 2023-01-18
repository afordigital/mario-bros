const uuid = require('uuid')
const config = require('./config');

const EVENTS = {
  LOGGED: 'logged',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  MOVEMENT: 'movement'
}

// TODO: move model to other side
class Character {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.acceleration = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.position = {
      x: 50,
      y: 50,
    };
  }

  setAcceleration(acceleration) {
    this.acceleration = acceleration;
  }
  setVelocity(velocity) {
    this.velocity = velocity;
  }

  setPosition(position) {
    this.position = position;
  }

  save(charStorage) {
    return charStorage.addCharacter(this.id, this);
  }

  destroy(charStorage) {
    return charStorage.removeCharacter(this.id);
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
    let type = 'duck';
    if (payload.name === config.characters.mario.password) {
      payload.name = config.characters.mario.name;
      type = 'mario';
    }
    if (payload.name === config.characters.luigi.password) {
      payload.name = config.characters.luigi.name;
      type = 'luigi';
    }
    this._character = new Character(this._id, payload.name, type)
    await this._character.save(this._deps.repos.charactersConnected);
    this._send(EVENTS.LOGGED, { character: this._character })
    this._deps.bus.publish(EVENTS.CONNECTED, { character: this._character })
    const chars =
      await this._deps.repos.charactersConnected.retrieveCharacters()

    for (const char of Object.values(chars)) {
      if (char) {
        this._send(EVENTS.CONNECTED, { character: char })
      }
    }
  }

  _send (event, payload) {
    this._socket.send(JSON.stringify({ event, payload }))
  }

  async destroy () {
    this._deps.bus.publish(EVENTS.DISCONNECTED, { character: this._character });

    await this._character.destroy(this._deps.repos.charactersConnected)
    for (const unsub of this._unsubscribeCallbacks) {
      unsub();
    }
    this._socket.removeAllListeners();
    this._socket.close();
  }

  async _onMovement (payload) {
    this._character.setAcceleration(payload.acceleration);
    this._character.setVelocity(payload.velocity);
    this._character.setPosition(payload.position);
    await this._character.save(this._deps.repos.charactersConnected);
    this._deps.bus.publish(EVENTS.MOVEMENT, {
      character: this._character,
      movement: payload
    })
  }
}

module.exports = {
  Socket
}
