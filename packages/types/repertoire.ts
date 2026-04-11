import type { Colour } from './chessboard';
import type { Prettify, UUID } from './utility';

export type LineNotes = [string, ...string[]];
export type RepertoireLine = {
    player: Colour;
    startingFEN: string;
    PGN: string;
    notes: LineNotes;
};
export type TestLine = [string, RepertoireLine];
type RepertoireLines = Record<UUID, RepertoireLine>;

type Folder = { name: string };
type EmptyFolder = Folder & { contains: 'either'; children: [] };
type PopulatedFolder = Folder & {
    contains: 'folders' | 'lines';
    children: UUID[];
};
export type RepertoireFolder = EmptyFolder | PopulatedFolder;
type BaseFolder = Prettify<PopulatedFolder & { contains: 'folders' }>;

export type RepertoireFolderID = UUID | Colour;

export type Repertoire = {
    folders: { w: BaseFolder; b: BaseFolder; [id: UUID]: RepertoireFolder };
    lines: RepertoireLines;
};
export type RepertoireWithMethods = Repertoire & {
    folders: {
        create: (name: string, parent: RepertoireFolderID) => void;
        updateName: (id: RepertoireFolderID, newName: string) => void;
        updateLocation: (
            idToMove: UUID,
            newParentId: RepertoireFolderID
        ) => void;
        delete: (id: RepertoireFolderID) => boolean;
    };
    lines: {
        create: (line: RepertoireLine, parent: UUID) => void;
        updateLine: (id: UUID, line: RepertoireLine) => void;
        updateLocation: (idToMove: UUID, newParentId: UUID) => void;
        delete: (id: UUID) => void;
    };
};
