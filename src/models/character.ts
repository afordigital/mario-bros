interface Vector2 {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  type: string;
}

export interface Player {
  character: Character;
}