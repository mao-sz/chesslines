import type { NonEmptyArray, UUID } from './utility';

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

export type RepertoireFolderID = keyof RepertoireFolders;
