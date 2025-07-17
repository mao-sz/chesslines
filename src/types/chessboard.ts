export type Colour = 'w' | 'b';
export type FENPosition = string & {};
export type PieceLetter =
    | 'P'
    | 'N'
    | 'B'
    | 'R'
    | 'Q'
    | 'K'
    | 'p'
    | 'n'
    | 'b'
    | 'r'
    | 'q'
    | 'k';
export type PromotionPieceLetter = Exclude<PieceLetter, 'P' | 'p' | 'K' | 'k'>;
export type MoveInfo = {
    from: string;
    to: string;
    promoteTo?: PromotionPieceLetter;
};
export type Line = { pgn: string; player: Colour };
export type PixelCoordinates = { x: number; y: number };
