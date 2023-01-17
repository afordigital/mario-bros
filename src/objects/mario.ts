import { IImageConstructor } from '../interfaces/image.interface'

export class Mario extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body
  keyRight: Phaser.Input.Keyboard.Key
  keyLeft: Phaser.Input.Keyboard.Key
  keyUp: Phaser.Input.Keyboard.Key

  constructor(private _aParams: IImageConstructor, private _notifyMovement: Function) {
    super(_aParams.scene, _aParams.x, _aParams.y, _aParams.texture, _aParams.frame)

    this.keyRight = this.scene.input.keyboard.addKey('RIGHT')
    this.keyLeft = this.scene.input.keyboard.addKey('LEFT')
    this.keyUp = this.scene.input.keyboard.addKey('UP')

    this.initSprite()
    this.initPhysics()
    this.scene.add.existing(this)
  }

  private initSprite() {
    this.setScale(this._aParams.scale || 0.47)
  }

  private initPhysics() {
    this.scene.physics.world.enable(this)
  }

  _sendMovement() {
    this._notifyMovement({
      acceleration: this.body.acceleration,
      velocity: this.body.velocity,
      position: {
        x: this.body.x,
        y: this.body.y,
      }
    });
  }

  update(): void {
    // Horizontal movement
    if (this.keyRight.isDown) {
      this.body.setAccelerationX(100)
      this.setFlipX(false)
      this._sendMovement();
    } else if (this.keyLeft.isDown) {
      this.body.setAccelerationX(-100)
      this.setFlipX(true)
      this._sendMovement();
    } else {
      const mustSend = this.body.acceleration.x !== 0 || this.body.acceleration.y !== 0 || this.body.velocity.x !== 0 || this.body.velocity.y !== 0;
      this.body.setVelocityX(0)
      this.body.setAccelerationX(0)
      if (mustSend) {
        this._sendMovement();
      }
    }

    // Vertical movement
    if (this.keyUp.isDown && this.body.onFloor()) {
      this.body.setVelocityY(-180)
      this._sendMovement();
    }
  }
}
