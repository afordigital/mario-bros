import { IImageConstructor } from '../interfaces/image.interface';

enum Keys {
  UP = 'UP',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
}

export class RemotePlayer extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private _currentScene: Phaser.Scene;
  private _keys!: Map<Keys, Phaser.Input.Keyboard.Key>;

  constructor(private _aParams: IImageConstructor) {
    super(_aParams.scene, _aParams.x, _aParams.y, _aParams.texture, _aParams.frame);

    this._currentScene = _aParams.scene;
    this.initSprite();
    this.initPhysics();
    this.scene.add.existing(this);

    this._keys = new Map(Object.values(Keys).map(v => [v, this._addKey(v)]));
  }

  private _addKey(key: Keys) {
    return this._currentScene.input.keyboard.addKey(key);
  }

  setMovement(movement: { acceleration: Phaser.Math.Vector2 , velocity: Phaser.Math.Vector2 }) {
    this.body.setVelocity(movement.velocity.x, movement.velocity.y);
    this.body.setAcceleration(movement.acceleration.x, movement.acceleration.y);
  }

  private initSprite() {
    this.setScale(this._aParams.scale || 0.47);
    this.setFlipX(false);
  }

  private initPhysics() {
    this.scene.physics.world.enable(this);
  }

  private _handleAnimations(): void {
    if (this.body.velocity.y !== 0) {
      // mario is jumping or falling
      this.anims.stop();
      this.setFrame(4);
    } else if (this.body.velocity.x !== 0) {
      // mario is moving horizontal
      // check if mario is making a quick direction change
      if (
        (this.body.velocity.x < 0 && this.body.acceleration.x > 0) ||
        (this.body.velocity.x > 0 && this.body.acceleration.x < 0)
      ) {
        this.setFrame(5);
      }

      if (this.body.velocity.x > 0) {
        this.anims.play('left', true);
      } else {
        this.anims.play('left', true);
      }
    } else {
      this.anims.stop();
      this.setFrame(0);
      if (this._keys.get(Keys.DOWN).isDown) {
        this.setFrame(13);
      }
    }
  }

  update() {
    this._handleAnimations();
  }
}
