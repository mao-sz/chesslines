import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRepertoire } from './useRepertoire';

afterEach(vi.clearAllMocks);

const spyRandomUUID = vi.spyOn(crypto, 'randomUUID');
function getLatestUUID() {
    return spyRandomUUID.mock.results.at(-1)?.value;
}

function callUseRepertoire() {
    return renderHook(() =>
        useRepertoire({
            folders: {
                w: { name: 'White', contains: 'either', children: [] },
                b: { name: 'Black', contains: 'either', children: [] },
            },
            lines: {},
        })
    );
}

describe('useRepertoire', () => {
    it('Initialises folders with starting empty white/black folders only', () => {
        const { result } = callUseRepertoire();
        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'either', children: [] },
            b: { name: 'Black', contains: 'either', children: [] },
        });
    });

    it('Initialises lines as empty object', () => {
        const { result } = callUseRepertoire();
        expect(result.current.lines).toEqual({});
    });

    it('Adds new folder as a child of another folder', () => {
        const { result, rerender } = callUseRepertoire();
        result.current.folders.create('Black->This', 'b');
        rerender();

        const uuid = getLatestUUID();
        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'either', children: [] },
            b: { name: 'Black', contains: 'folders', children: [uuid] },
            [uuid]: { name: 'Black->This', contains: 'either', children: [] },
        });
    });

    it('Adds new line', () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            '1. e4 e5 2. Nc3',
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        expect(result.current.lines).toEqual({
            [uuid]: {
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',
            },
        });
    });

    it("Sets new line's parent folder to a lines type with the UUID as a child", () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            '1. e4 e5 2. Nc3',
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        expect(result.current.folders.w.children.at(-1)).toBe(uuid);
    });

    it("Updates an existing folder's name", () => {
        const { result, rerender } = callUseRepertoire();
        result.current.folders.updateName('b', 'Updated Black');
        rerender();

        expect(result.current.folders.b.name).toBe('Updated Black');
    });

    it("Updates an existing folder's location", () => {
        const { result, rerender } = callUseRepertoire();
        result.current.folders.create('Black->This', 'b');
        rerender();

        const uuid = getLatestUUID();
        result.current.folders.updateLocation(uuid, 'w');
        rerender();

        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'folders', children: [uuid] },
            b: { name: 'Black', contains: 'either', children: [] },
            [uuid]: { name: 'Black->This', contains: 'either', children: [] },
        });
    });

    it("Updates an existing line's contents", () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            '1. e4 e5 2. Nc3',
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        result.current.lines.updateLine(
            uuid,
            'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
            '2. Nc3 Nc6'
        );
        rerender();

        expect(result.current.lines).toEqual({
            [uuid]: {
                startingFEN:
                    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
                PGN: '2. Nc3 Nc6',
            },
        });
    });

    it("Updates an existing line's location", () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            '1. e4 e5 2. Nc3',
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        result.current.lines.updateLocation(uuid, 'b');
        rerender();

        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'either', children: [] },
            b: { name: 'Black', contains: 'lines', children: [uuid] },
        });
    });

    it('Deletes an existing folder with no children', () => {
        const { result, rerender } = callUseRepertoire();
        result.current.folders.create('Black->This', 'b');
        rerender();

        const uuid = getLatestUUID();
        result.current.folders.delete(uuid);
        rerender();

        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'either', children: [] },
            b: { name: 'Black', contains: 'either', children: [] },
        });
    });

    it('Prevents deleting a folder that contains children', () => {
        const { result, rerender } = callUseRepertoire();
        result.current.folders.create("Can't delete me!", 'b');
        rerender();

        const parentUUID = getLatestUUID();
        result.current.folders.create('Prevents parent deletion', parentUUID);
        rerender();

        const isFolderDeleted = result.current.folders.delete(parentUUID);
        rerender();

        const childUUID = getLatestUUID();
        expect(isFolderDeleted).toBe(false);
        expect(result.current.folders[parentUUID]).toEqual({
            name: "Can't delete me!",
            contains: 'folders',
            children: [childUUID],
        });
    });

    it('Prevents deleting the base w/b folders', () => {
        const { result, rerender } = callUseRepertoire();

        const isWhiteFolderDeleted = result.current.folders.delete('w');
        rerender();
        const isBlackFolderDeleted = result.current.folders.delete('b');
        rerender();

        expect(isWhiteFolderDeleted).toBe(false);
        expect(isBlackFolderDeleted).toBe(false);
        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'either', children: [] },
            b: { name: 'Black', contains: 'either', children: [] },
        });
    });

    it('Deletes an existing line', () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            '1. e4 e5 2. Nc3',
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        result.current.lines.delete(uuid);
        rerender();

        expect(result.current.lines).toEqual({});
    });

    it('Removes lines ID from parent folder children array when deleted', () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            '1. e4 e5 2. Nc3',
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        result.current.lines.delete(uuid);
        rerender();

        expect(result.current.folders.w).toEqual({
            name: 'White',
            contains: 'either',
            children: [],
        });
    });
});
