import { renderHook } from '@testing-library/react';
import { useRepertoire } from '@/hooks/useRepertoire';
import type { UUID } from '@/types/utility';
import type { Line } from '@/types/chessboard';
import type { Repertoire } from '@/types/repertoire';

export const UUIDS: Record<'folders' | 'lines', UUID[]> = {
    lines: [
        '68cafccd-d7b8-4f92-9153-9df59eee4f00',
        '68cafccd-d7b8-4f92-9153-9df59eee4f01',
        '68cafccd-d7b8-4f92-9153-9df59eee4f02',
    ],
    folders: [
        '68cafccd-d7b8-4f92-9153-9df59eee4f03',
        '68cafccd-d7b8-4f92-9153-9df59eee4f04',
    ],
};

const repertoire = {
    get empty(): Repertoire {
        return {
            folders: {
                w: { name: 'White', contains: 'either', children: [] },
                b: { name: 'Black', contains: 'either', children: [] },
            },
            lines: {},
        };
    },
    get withFolderInWhite(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'folders',
                    children: [UUIDS.folders[0]],
                },
                b: { name: 'Black', contains: 'either', children: [] },
                [UUIDS.folders[0]]: {
                    name: 'Child',
                    contains: 'either',
                    children: [],
                },
            },
            lines: {},
        };
    },
    get withLineInWhite(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'lines',
                    children: [UUIDS.lines[0]],
                },
                b: { name: 'Black', contains: 'either', children: [] },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5',
                },
            },
        };
    },
    get withNonstandardLineInWhite(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'lines',
                    children: [UUIDS.lines[0]],
                },
                b: { name: 'Black', contains: 'either', children: [] },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    startingFEN:
                        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
                    PGN: '2. Nc3',
                },
            },
        };
    },
    get withInvalidLineInWhite(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'lines',
                    children: [UUIDS.lines[0]],
                },
                b: { name: 'Black', contains: 'either', children: [] },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    startingFEN:
                        'rnbqkbnr/psd8as8d7ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. asdklke4 e5',
                },
            },
        };
    },
    get manyFoldersAndLines(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'lines',
                    children: [UUIDS.lines[0], UUIDS.lines[1]],
                },
                b: {
                    name: 'Black',
                    contains: 'folders',
                    children: [UUIDS.folders[0]],
                },
                [UUIDS.folders[0]]: {
                    name: 'lines here',
                    contains: 'lines',
                    children: [UUIDS.lines[2]],
                },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5 2. Nc3',
                },
                [UUIDS.lines[1]]: {
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5 2. d4 d5 3. f4',
                },
                [UUIDS.lines[2]]: {
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5 2. d4 exd4 3. c3 dxc3',
                },
            },
        };
    },
    get withNestedFolders(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'folders',
                    children: [UUIDS.folders[0]],
                },
                b: { name: 'Black', contains: 'either', children: [] },
                [UUIDS.folders[0]]: {
                    name: 'Child',
                    contains: 'folders',
                    children: [UUIDS.folders[1]],
                },
                [UUIDS.folders[1]]: {
                    name: 'Child of child',
                    contains: 'either',
                    children: [],
                },
            },
            lines: {},
        };
    },
};

const lines = {
    get singleMove(): Record<string, Line[]> {
        return {
            w: [{ pgn: '1. d4', player: 'w' }],
            b: [{ pgn: '1. e4 e5', player: 'b' }],
        };
    },
    get multiMove(): Record<string, Line[]> {
        return { w: [{ pgn: '1. d4 d5 2. c4', player: 'w' }] };
    },
    get multiLines(): Record<string, Line[]> {
        return {
            twoLines: Array(2).fill({ pgn: '1. d4', player: 'w' }),
            tenLines: Array(10).fill({ pgn: '1. d4', player: 'w' }),
        };
    },
};

const hooks = {
    callUseRepertoire() {
        return renderHook(() =>
            useRepertoire({
                folders: {
                    w: { name: 'White', contains: 'either', children: [] },
                    b: { name: 'Black', contains: 'either', children: [] },
                },
                lines: {},
            })
        );
    },
};

export const helpers = { repertoire, lines, hooks };
