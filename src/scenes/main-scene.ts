import { MessageController } from '../messaging/Message'
import { Player } from '../models/character'
import { Mario } from '../objects/mario'
import { RemotePlayer } from '../objects/mario_remote';

export class MainScene extends Phaser.Scene {
  private mario: Mario
  private _layer: Phaser.Tilemaps.TilemapLayer;
  private _players: Record<string, any> = {};
  private _isCreated = false;
  private _createBuffer: any[] = [];
  private _disconnectedBuffer: any[] = [];
  private _movementBuffer: any[] = [];

  constructor(config: Phaser.Types.Scenes.SettingsConfig, private _selfPlayer: Player, private _messaging: MessageController) {
    super(config)

    this._messaging.on('connected', (player) => {
      if (player.character.id === this._selfPlayer.character.id) return;
      if (!this._isCreated) {
        this._createBuffer.push(player);
        return;
      }
      this._createRemotePlayer(player);
    });


    this._messaging.on('disconnected', (player) => {
      if (player.character.id === this._selfPlayer.character.id) return;
      if (!this._isCreated) {
        this._disconnectedBuffer.push(player);
        return;
      }
      this._removeRemotePlayer(player);
    });


    this._messaging.on('movement', (payload) => {
      if (payload.character.id === this._selfPlayer.character.id) return;
      if (!this._isCreated) {
        this._movementBuffer.push(payload);
        return;
      }
      this._moveRemotePlayer(payload);
    });
  }

  private _createRemotePlayer(player: Player) {
    const sprite = new RemotePlayer({
      scene: this,
      x: player.character.position.x,
      y: player.character.position.y,
      texture: 'mario',
    })
    this._players[player.character.id] = {
      player,
      sprite,
    }

    this.physics.add.collider(sprite, this._layer);
  }

  private _removeRemotePlayer(player: any) {
    const remote = this._players[player.character.id];
    if (remote) {
      const rp = remote.sprite as RemotePlayer;
      rp.destroy(true);
    }
  }

  private _moveRemotePlayer(payload: any) {
    const remote = this._players[payload.character.id];
    if (remote) {
      const rp = remote.sprite as RemotePlayer;
      rp.setMovement(payload.movement);
    }
  }

  preload(): void {
    this.load.tilemapTiledJSON('objects', './assets/map1-1.json')
    this.load.image('tiles', './assets/items2.png')

    this.load.spritesheet('mario', './assets/marioSmall.png', {
      frameWidth: 34,
      frameHeight: 34
    })


    this.load.spritesheet('duck', './assets/duck-pixel.png', {
      frameWidth: 100,
      frameHeight: 100
    })
  }

  create(): void {
    const map = this.make.tilemap({ key: 'objects' })
    const tileset = map.addTilesetImage('items', 'tiles')
    this._layer = map.createLayer('world1', tileset, 0, 0)

    map.setCollisionBetween(14, 16, true)
    map.setCollisionBetween(21, 22, true)
    map.setCollisionBetween(27, 28, true)
    map.setCollision(10)
    map.setCollision(13)
    map.setCollision(17)
    map.setCollision(40)

    this.mario = new Mario({
      scene: this,
      x: this._selfPlayer.character.position.x,
      y: this._selfPlayer.character.position.y,
      texture: 'mario'
    }, (movement: any) => this._messaging.movement(movement))

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.mario)
    this.physics.add.collider(this.mario, this._layer)

    this._isCreated = true;
    for (const player of this._createBuffer) {
      this._createRemotePlayer(player);
    }
    for (const player of this._disconnectedBuffer) {
      this._removeRemotePlayer(player);
    }
    for (const payload of this._movementBuffer) {
      this._moveRemotePlayer(payload);
    }
    this._createBuffer = [];
    this._disconnectedBuffer = [];
    this._movementBuffer = [];
  }

  update(): void {
    this.mario.update()
  }
}
