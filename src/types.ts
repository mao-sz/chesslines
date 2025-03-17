import type { Dispatch, SetStateAction } from 'react';

export type Colour = 'w' | 'b';
export type FENPosition = string & {};
export type MoveInfo = { from: string; to: string };
export type StateSetter<T> = Dispatch<SetStateAction<T>>;
export type Line = { pgn: string; player: Colour };
