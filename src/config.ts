import { MainScene } from './scenes/main-scene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Afomario',
  url: 'https://github.com/Aforina/mario-phaser.git',
  version: '2.0',
  width: 512,
  height: 256,
  backgroundColor: 0x5c94fc,
  type: Phaser.AUTO,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [MainScene]
}
