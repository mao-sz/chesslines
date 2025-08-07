import { describe, it, expect, vi } from 'vitest';
import { helpers, UUIDS } from '@/testing/helpers';
import { useOutletContext } from 'react-router';

const { callUseDeepContainsSelectedLine, callUseRepertoire } = helpers.hooks;

vi.mock('react-router', { spy: true });
const spyRandomUUID = vi.spyOn(crypto, 'randomUUID');
function getLatestUUID() {
    return spyRandomUUID.mock.results.at(-1)?.value;
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
            {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',
                notes: [''],
            },
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        expect(result.current.lines).toEqual({
            [uuid]: {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',
                notes: [''],
            },
        });
    });

    it("Sets new line's parent folder to a lines type with the UUID as a child", () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',
                notes: [''],
            },
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
            {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',
                notes: ['', '', '', ''],
            },
            'w'
        );
        rerender();

        const uuid = getLatestUUID();
        result.current.lines.updateLine(uuid, {
            player: 'w',
            startingFEN:
                'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',

            PGN: '2. Nc3 Nc6',
            notes: ['', '', 'change'],
        });
        rerender();

        expect(result.current.lines).toEqual({
            [uuid]: {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
                PGN: '2. Nc3 Nc6',
                notes: ['', '', 'change'],
            },
        });
    });

    it("Updates an existing line's location", () => {
        const { result, rerender } = callUseRepertoire();
        result.current.lines.create(
            {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',

                notes: [''],
            },
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
            {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',
                notes: ['', '', '', ''],
            },
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
            {
                player: 'w',
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                PGN: '1. e4 e5 2. Nc3',
                notes: ['', '', '', ''],
            },
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

describe('useDeepContainsSelectedLine', () => {
    const { folders } = helpers.repertoire.manyFoldersAndLines;
    const emptyFolderID = UUIDS.folders[2];

    it('Returns true if lines folder contains a selected line', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            lineIDsToTrain: [UUIDS.lines[1]],
        });

        const { result } = callUseDeepContainsSelectedLine(
            folders,
            UUIDS.folders[0]
        );
        expect(result.current).toBe(true);
    });

    it('Returns true if folders folder deeply contains a selected line', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            lineIDsToTrain: [UUIDS.lines[1]],
        });

        const { result } = callUseDeepContainsSelectedLine(folders, 'w');
        expect(result.current).toBe(true);
    });

    it('Returns false if lines folder does not contain a selected line', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            lineIDsToTrain: [UUIDS.lines[0]],
        });

        const { result } = callUseDeepContainsSelectedLine(
            folders,
            UUIDS.folders[0]
        );
        expect(result.current).toBe(false);
    });

    it('Returns false if folders folder does not deeply contain a selected line', () => {
        vi.mocked(useOutletContext).mockReturnValue({ lineIDsToTrain: [] });

        const { result } = callUseDeepContainsSelectedLine(folders, 'w');
        expect(result.current).toBe(false);
    });

    it('Returns false if folder is empty', () => {
        vi.mocked(useOutletContext).mockReturnValue({ lineIDsToTrain: [] });

        const { result } = callUseDeepContainsSelectedLine(
            folders,
            emptyFolderID
        );
        expect(result.current).toBe(false);
    });
});
