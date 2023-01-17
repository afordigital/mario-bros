import 'Phaser'
import { GameConfig } from './config'
import { MessageController } from './messaging/Message';
import { Player } from './models/character';
import { MainScene } from './scenes/main-scene';

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig, selfPlayer: Player, messaging: MessageController) {
    super({
      ...config,
      scene: [
        new MainScene({ key: 'MainScene' }, selfPlayer, messaging),
      ]
    });
  }
}
