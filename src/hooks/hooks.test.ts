import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRepertoire } from './useRepertoire';

afterEach(vi.resetAllMocks);

describe('useRepertoire', () => {
    it('Initialises folders with starting empty white/black folders only', () => {
        const { result } = renderHook(useRepertoire);
        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'either', children: [] },
            b: { name: 'Black', contains: 'either', children: [] },
        });
    });

    it('Initialises lines as empty object', () => {
        const { result } = renderHook(useRepertoire);
        expect(result.current.lines).toEqual({});
    });

    it('Adds new folder as a child of another folder', () => {
        const mockUUID = crypto.randomUUID();
        crypto.randomUUID = vi.fn(() => mockUUID);

        const { result, rerender } = renderHook(useRepertoire);
        result.current.addFolder({ name: 'Black->This', parent: 'b' });
        rerender();

        expect(result.current.folders).toEqual({
            w: { name: 'White', contains: 'either', children: [] },
            b: { name: 'Black', contains: 'folders', children: [mockUUID] },
            [mockUUID]: {
                name: 'Black->This',
                contains: 'either',
                children: [],
            },
        });
    });

    it('Adds new line', () => {
        const mockUUID = crypto.randomUUID();
        crypto.randomUUID = vi.fn(() => mockUUID);

        const { result, rerender } = renderHook(useRepertoire);
        result.current.addLine({
            startingFEN:
                'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            pgn: '1. e4 e5 2. Nc3',
            parent: 'w',
        });
        rerender();

        expect(result.current.lines).toEqual({
            [mockUUID]: {
                startingFEN:
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                pgn: '1. e4 e5 2. Nc3',
            },
        });
    });

    it("Sets new line's parent folder to a lines type with the UUID as a child", () => {
        const mockUUID = crypto.randomUUID();
        crypto.randomUUID = vi.fn(() => mockUUID);

        const { result, rerender } = renderHook(useRepertoire);
        result.current.addLine({
            startingFEN:
                'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            pgn: '1. e4 e5 2. Nc3',
            parent: 'w',
        });
        rerender();

        expect(result.current.folders.w.children.at(-1)).toBe(mockUUID);
    });
});
