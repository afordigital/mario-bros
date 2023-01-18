import 'Phaser'
import { MessageController } from './messaging/Message';
import { Player } from './models/character';
import { MainScene } from './scenes/main-scene';

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig, isViewMode: boolean, selfPlayer: Player, messaging: MessageController) {
    if (isViewMode) {
      config.backgroundColor = 0x00FF00;
    }
    super({
      ...config,
      scene: [
        new MainScene({ key: 'MainScene' }, selfPlayer, messaging),
      ]
    });
  }
}
