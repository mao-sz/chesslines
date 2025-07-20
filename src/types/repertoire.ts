import type { Colour } from './chessboard';
import type { NonEmptyArray, UUID } from './utility';

export type LineNotes = [string, ...string[]];
export type RepertoireLine = {
    player: Colour;
    startingFEN: string;
    PGN: string;
    notes: LineNotes;
};
type RepertoireLines = Record<UUID, RepertoireLine>;

type Folder = { name: string };
type EmptyFolder = Folder & { contains: 'either'; children: [] };
type NonEmptyFolder = Folder & {
    contains: 'folders' | 'lines';
    children: NonEmptyArray<UUID>;
};
export type RepertoireFolder = EmptyFolder | NonEmptyFolder;
type RepertoireFolders = {
    w: RepertoireFolder & { name: 'White' };
    b: RepertoireFolder & { name: 'Black' };
    [key: UUID]: RepertoireFolder;
};

export type RepertoireFolderID = keyof RepertoireFolders;

export type Repertoire = { folders: RepertoireFolders; lines: RepertoireLines };
export type RepertoireWithMethods = {
    folders: RepertoireFolders & {
        create: (name: string, parent: RepertoireFolderID) => void;
        updateName: (id: RepertoireFolderID, newName: string) => void;
        updateLocation: (
            idToMove: UUID,
            newParentId: RepertoireFolderID
        ) => void;
        delete: (id: RepertoireFolderID) => boolean;
    };
    lines: RepertoireLines & {
        create: (line: RepertoireLine, parent: RepertoireFolderID) => void;
        updateLine: (id: UUID, line: RepertoireLine) => void;
        updateLocation: (
            idToMove: UUID,
            newParentId: RepertoireFolderID
        ) => void;
        delete: (id: UUID) => void;
    };
};
