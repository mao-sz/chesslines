import { renderHook } from '@testing-library/react';
import { useRepertoire } from '@/hooks/useRepertoire';
import type { Line } from '@/types/chessboard';
import type { Repertoire } from '@/types/repertoire';

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
                    children: ['68cafccd-d7b8-4f92-9153-9df59eee4f0d'],
                },
                b: { name: 'Black', contains: 'either', children: [] },
                '68cafccd-d7b8-4f92-9153-9df59eee4f0d': {
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
                    children: ['3aed7526-7462-4824-8cc1-9dacf63c64cd'],
                },
                b: { name: 'Black', contains: 'either', children: [] },
            },
            lines: {
                '3aed7526-7462-4824-8cc1-9dacf63c64cd': {
                    startingFEN: '3aed7526-7462-4824-8cc1-9dacf63c64cd',
                    PGN: '1. e4 e5',
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
                    children: ['68cafccd-d7b8-4f92-9153-9df59eee4f0d'],
                },
                b: { name: 'Black', contains: 'either', children: [] },
                '68cafccd-d7b8-4f92-9153-9df59eee4f0d': {
                    name: 'Child',
                    contains: 'folders',
                    children: ['57cafccd-d7b8-4f92-9153-9df59eee4f0d'],
                },
                '57cafccd-d7b8-4f92-9153-9df59eee4f0d': {
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
