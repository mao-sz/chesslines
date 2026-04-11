import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LichessAnalysisButton } from './LichessAnalysisButton';
import { STANDARD_STARTING_FEN } from '@/util/constants';

describe('Lichess link', () => {
    it.each([
        ['target', '_blank'],
        ['rel', 'noopener noreferrer'],
    ])('Has "%s" attribute with value "%s"', (attribute, value) => {
        render(
            <LichessAnalysisButton
                startingFEN={STANDARD_STARTING_FEN}
                moves=""
                orientation="w"
            />
        );
        const link = screen.getByRole('link', {
            name: /analyse line in lichess in new tab/i,
        });

        expect(link).toHaveAttribute(attribute, value);
    });

    it('Has href with encoded move list only if standard starting FEN', () => {
        render(
            <LichessAnalysisButton
                startingFEN={STANDARD_STARTING_FEN}
                moves="1. e4 e5 2. Nc3"
                orientation="w"
            />
        );
        const link = screen.getByRole('link', {
            name: /analyse line in lichess in new tab/i,
        });

        expect(link).toHaveAttribute(
            'href',
            'https://lichess.org/analysis/pgn/1.%20e4%20e5%202.%20Nc3'
        );
    });

    it('Includes encoded FEN tag pair in href if non-standard starting FEN', () => {
        render(
            <LichessAnalysisButton
                startingFEN="rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2"
                moves="2... Nf6 3. f4"
                orientation="w"
            />
        );
        const link = screen.getByRole('link', {
            name: /analyse line in lichess in new tab/i,
        });

        expect(link).toHaveAttribute(
            'href',
            'https://lichess.org/analysis/pgn/%5BFEN%20%22rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR%20b%20KQkq%20-%201%202%22%5D2...%20Nf6%203.%20f4'
        );
    });

    it('Includes black query param if the line player colour is black', () => {
        render(
            <LichessAnalysisButton
                startingFEN="rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2"
                moves="2... Nf6 3. f4"
                orientation="b"
            />
        );
        const link = screen.getByRole('link', {
            name: /analyse line in lichess in new tab/i,
        });

        expect(link).toHaveAttribute(
            'href',
            'https://lichess.org/analysis/pgn/%5BFEN%20%22rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR%20b%20KQkq%20-%201%202%22%5D2...%20Nf6%203.%20f4?color=black'
        );
    });
});
