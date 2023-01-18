const { EventEmitter } = require('events')

class MemoryBus {
  constructor () {
    this._ev = new EventEmitter()
  }

  subscribe (channel, cb) {
    this._ev.on(channel, cb)

    return () => {
      this._ev.off(channel, cb);
    };
  }

  publish (channel, message) {
    this._ev.emit(channel, message)
  }
}

module.exports = {
  MemoryBus
}
