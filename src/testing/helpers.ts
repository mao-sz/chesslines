import { renderHook, screen } from '@testing-library/react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { STANDARD_STARTING_FEN } from '@/util/constants';
import type { UUID } from '@/types/utility';
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
        '68cafccd-d7b8-4f92-9153-9df59eee4f05',
        '68cafccd-d7b8-4f92-9153-9df59eee4f06',
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
                    player: 'w',
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5',
                    notes: ['', '', ''],
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
                    player: 'w',
                    startingFEN:
                        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
                    PGN: '2. Nc3',
                    notes: ['', ''],
                },
            },
        };
    },
    get withLineWithNotes(): Repertoire {
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
                    player: 'w',
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5 2. Nc3 Nf6 3. f4 exf4',
                    notes: [
                        '',
                        '',
                        '',
                        'Vienna',
                        '',
                        'Vienna gambit',
                        'mistake',
                    ],
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
                    player: 'w',
                    startingFEN:
                        'rnbqkbnr/psd8as8d7ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. asdklke4 e5',
                    notes: [''],
                },
            },
        };
    },
    get manyFoldersAndLines(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'folders',
                    children: [
                        UUIDS.folders[0],
                        UUIDS.folders[1],
                        UUIDS.folders[3],
                    ],
                },
                b: { name: 'Black', contains: 'either', children: [] },
                [UUIDS.folders[0]]: {
                    name: 'line folder',
                    contains: 'lines',
                    children: [UUIDS.lines[1], UUIDS.lines[2]],
                },
                [UUIDS.folders[1]]: {
                    name: 'folder folder',
                    contains: 'folders',
                    children: [UUIDS.folders[2]],
                },
                [UUIDS.folders[2]]: {
                    name: 'empty folder',
                    contains: 'either',
                    children: [],
                },
                [UUIDS.folders[3]]: {
                    name: 'another line folder',
                    contains: 'lines',
                    children: [UUIDS.lines[0]],
                },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    player: 'w',
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5 2. Nc3 Nf6',
                    notes: [''],
                },
                [UUIDS.lines[1]]: {
                    player: 'w',
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5 2. d4 d5 3. f4 f5',
                    notes: [''],
                },
                [UUIDS.lines[2]]: {
                    player: 'w',
                    startingFEN:
                        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    PGN: '1. e4 e5 2. d4 exd4 3. c3 dxc3',
                    notes: [''],
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

const testRepertoire = {
    get withSingleWhiteLine(): Repertoire {
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
                    player: 'w',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4',
                    notes: ['', ''],
                },
            },
        };
    },
    get withSingleBlackLine(): Repertoire {
        return {
            folders: {
                w: { name: 'White', contains: 'either', children: [] },
                b: {
                    name: 'Black',
                    contains: 'lines',
                    children: [UUIDS.lines[0]],
                },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    player: 'b',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4 d5',
                    notes: ['', '', ''],
                },
            },
        };
    },
    get forHintsTesting(): Repertoire {
        return {
            folders: {
                w: { name: 'White', contains: 'either', children: [] },
                b: {
                    name: 'Black',
                    contains: 'lines',
                    children: [UUIDS.lines[0], UUIDS.lines[1]],
                },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    player: 'b',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4 d5',
                    notes: ['', '', 'Symmetrical'],
                },
                [UUIDS.lines[1]]: {
                    player: 'b',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4 Nf6',
                    notes: ['', '', 'Indian defense'],
                },
            },
        };
    },
    get withManyMixedLines(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'lines',
                    children: [UUIDS.lines[0], UUIDS.lines[2]],
                },
                b: {
                    name: 'Black',
                    contains: 'lines',
                    children: [UUIDS.lines[1]],
                },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    player: 'w',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4 d5 2. c4',
                    notes: ['', '', '', ''],
                },
                [UUIDS.lines[1]]: {
                    player: 'b',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4 d5',
                    notes: ['', '', ''],
                },
                [UUIDS.lines[2]]: {
                    player: 'w',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4',
                    notes: ['', ''],
                },
            },
        };
    },
    get withLinesWithNotes(): Repertoire {
        return {
            folders: {
                w: {
                    name: 'White',
                    contains: 'lines',
                    children: [UUIDS.lines[0], UUIDS.lines[2]],
                },
                b: {
                    name: 'Black',
                    contains: 'lines',
                    children: [UUIDS.lines[1]],
                },
            },
            lines: {
                [UUIDS.lines[0]]: {
                    player: 'w',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4 d5 2. c4',
                    notes: ['', 'No e4 shenanigans', '', "Queen's gambit"],
                },
                [UUIDS.lines[1]]: {
                    player: 'b',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4 d5',
                    notes: ['', '', ''],
                },
                [UUIDS.lines[2]]: {
                    player: 'w',
                    startingFEN: STANDARD_STARTING_FEN,
                    PGN: '1. d4',
                    notes: ['', ''],
                },
            },
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

function serialiseCurrentBoard() {
    return screen
        .getAllByRole('button', { name: /square$/i })
        .map((node: HTMLElement) => {
            const attributesParentProperty = Object.keys(node).find((key) =>
                key.startsWith('__reactProps')
            )!;
            // @ts-expect-error Hacky way to serialise React virtual DOM nodes based on attributes contents without messing with exact types
            const attributes = node[attributesParentProperty];

            return `${attributes['aria-label']} ${attributes['data-contains']}`;
        });
}

function setUpTestRepertoire(repertoire: Repertoire): Repertoire {
    window.localStorage.setItem('repertoire', JSON.stringify(repertoire));
    return repertoire;
}

export const helpers = {
    repertoire,
    testRepertoire,
    hooks,
    serialiseCurrentBoard,
    setUpTestRepertoire,
};
