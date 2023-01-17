const { EventEmitter } = require('events')

class MemoryBus {
  constructor () {
    this._ev = new EventEmitter()
  }

  subscribe (channel, cb) {
    console.debug(`Subscribed to ${channel}`)
    this._ev.on(channel, cb)

    return () => {
      this._ev.off(channel, cb);
    };
  }

  publish (channel, message) {
    console.debug(`Publishing to ${channel} with `, message)
    this._ev.emit(channel, message)
  }
}

module.exports = {
  MemoryBus
}
