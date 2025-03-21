import type { Dispatch, SetStateAction } from 'react';

type NonEmptyArray<T> = [T, ...T[]];

export type Colour = 'w' | 'b';
export type FENPosition = string & {};
export type MoveInfo = { from: string; to: string };
export type StateSetter<T> = Dispatch<SetStateAction<T>>;
export type Line = { pgn: string; player: Colour };
export type PixelCoordinates = { x: number; y: number };

type UUID = `${string}-${string}-${string}-${string}-${string}`;

type RepertoireLine = { startingFEN: string; pgn: string };
export type RepertoireLines = Record<UUID, RepertoireLine>;

type Folder = { name: string };
type EmptyFolder = Folder & { contains: 'either'; children: [] };
type NonEmptyFolder = Folder & {
    contains: 'folders' | 'lines';
    children: NonEmptyArray<UUID>;
};
type RepertoireFolder = EmptyFolder | NonEmptyFolder;
export type RepertoireFolders = {
    w: RepertoireFolder & { name: 'White' };
    b: RepertoireFolder & { name: 'Black' };
    [key: UUID]: RepertoireFolder;
};
