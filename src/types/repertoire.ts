import type { NonEmptyArray, UUID } from './utility';

type RepertoireLine = { startingFEN: string; PGN: string };
export type RepertoireLines = Record<UUID, RepertoireLine>;
export type RepertoireLinesWithMethods = RepertoireLines & {
    create: (
        startingFEN: string,
        PGN: string,
        parent: RepertoireFolderID
    ) => void;
    updateLine: (id: UUID, newStartingFEN: string, newPGN: string) => void;
    updateLocation: (idToMove: UUID, newParentId: RepertoireFolderID) => void;
    delete: (id: RepertoireFolderID) => boolean;
};

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
export type RepertoireFoldersWithMethods = RepertoireFolders & {
    create: (name: string, parent: RepertoireFolderID) => void;
    updateName: (id: RepertoireFolderID, newName: string) => void;
    updateLocation: (idToMove: UUID, newParentId: RepertoireFolderID) => void;
    delete: (id: RepertoireFolderID) => boolean;
};

export type RepertoireFolderID = keyof RepertoireFolders;
