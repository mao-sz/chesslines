export type Colour = 'w' | 'b';
export type FENPosition = string & {};
export type MoveInfo = { from: string; to: string };
export type Line = { pgn: string; player: Colour };
export type PixelCoordinates = { x: number; y: number };
