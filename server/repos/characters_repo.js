// This implementation is async because in future we'll need access to external systems as database
class MemoryCharactersRepo {
  constructor () {
    this._inner = Object.create(null)
  }

  async addCharacter (id, character) {
    this._inner[id] = character
  }

  async removeCharacter (id) {
    // We don't use `delete` to avoid slow objects
    this._inner[id] = undefined
  }

  async retrieveCharacters (id) {
    return Object.values(this._inner)
  }
}

module.exports = {
  MemoryCharactersRepo
}
