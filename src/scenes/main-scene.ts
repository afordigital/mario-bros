import { Mario } from '../objects/mario'

export class MainScene extends Phaser.Scene {
  private mario: Mario

  constructor () {
    super({ key: 'MainScene' })
  }

  preload (): void {
    this.load.tilemapTiledJSON('objects', './assets/map1-1.json')
    this.load.image('tiles', './assets/items2.png')

    this.load.spritesheet('mario', './assets/marioSmall.png', {
      frameWidth: 34,
      frameHeight: 34
    })
  }

  create (): void {
    const map = this.make.tilemap({ key: 'objects' })
    const tileset = map.addTilesetImage('items', 'tiles')
    const layer = map.createLayer('world1', tileset, 0, 0)

    map.setCollisionBetween(14, 16, true)
    map.setCollisionBetween(21, 22, true)
    map.setCollisionBetween(27, 28, true)
    map.setCollision(10)
    map.setCollision(13)
    map.setCollision(17)
    map.setCollision(40)

    this.mario = new Mario({
      scene: this,
      x: 100,
      y: 100,
      texture: 'mario'
    })

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.mario)
    this.physics.add.collider(this.mario, layer)
  }

  update (): void {
    this.mario.update()
  }
}
