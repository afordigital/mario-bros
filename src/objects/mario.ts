import { IImageConstructor } from '../interfaces/image.interface'

export class Mario extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body
  keyRight: Phaser.Input.Keyboard.Key
  keyLeft: Phaser.Input.Keyboard.Key
  keyUp: Phaser.Input.Keyboard.Key

  constructor (aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.keyRight = this.scene.input.keyboard.addKey('RIGHT')
    this.keyLeft = this.scene.input.keyboard.addKey('LEFT')
    this.keyUp = this.scene.input.keyboard.addKey('UP')

    this.initSprite()
    this.initPhysics()
    this.scene.add.existing(this)
  }

  private initSprite () {
    this.setScale(0.47)
  }

  private initPhysics () {
    this.scene.physics.world.enable(this)
  }

  update (): void {
    // Horizontal movement
    if (this.keyRight.isDown) {
      this.body.setAccelerationX(100)
      this.setFlipX(false)
    } else if (this.keyLeft.isDown) {
      this.body.setAccelerationX(-100)
      this.setFlipX(true)
    } else {
      this.body.setVelocityX(0)
      this.body.setAccelerationX(0)
    }

    // Vertical movement
    if (this.keyUp.isDown && this.body.onFloor()) {
      this.body.setVelocityY(-180)
    }
  }
}
