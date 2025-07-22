import { useOutletContext } from 'react-router';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrainerPage } from '../TrainerPage';
import { helpers } from '@/testing/helpers';

afterEach(vi.restoreAllMocks);
vi.mock('react-router');
vi.mock('@/util/util.ts', async (importActual) => ({
    ...(await importActual()),
    toShuffled: vi.fn((lines) => lines),
}));

describe('Initial elements', () => {
    it('Renders 8x8 chessboard with pieces', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.testRepertoire.withSingleWhiteLine,
        });
        render(<TrainerPage />);

        expect(
            screen.getAllByRole('button', { name: /square$/i })
        ).toHaveLength(64);
        expect(screen.getAllByRole('img', { name: /pawn$/i })).toHaveLength(16);
        expect(screen.getAllByRole('img', { name: /rook$/i })).toHaveLength(4);
        expect(screen.getAllByRole('img', { name: /knight$/i })).toHaveLength(
            4
        );
        expect(screen.getAllByRole('img', { name: /bishop$/i })).toHaveLength(
            4
        );
        expect(screen.getAllByRole('img', { name: /queen$/i })).toHaveLength(2);
        expect(screen.getAllByRole('img', { name: /king$/i })).toHaveLength(2);
    });

    it('Renders flipped chessboard if line is played as black', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.testRepertoire.withSingleBlackLine,
        });
        render(<TrainerPage />);

        const squares = screen.getAllByRole('button', { name: /square$/i });
        expect(squares.at(0)?.ariaLabel).toBe('h1 square');
        expect(squares.at(-1)?.ariaLabel).toBe('a8 square');
        expect(
            within(squares.at(-1)!).getByAltText('black rook')
        ).toBeInTheDocument();
    });

    it('Renders button for next line when incomplete lines remain after current line', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.testRepertoire.withManyMixedLines,
        });
        render(<TrainerPage />);

        expect(
            screen.getByRole('button', { name: /next line/i })
        ).toBeInTheDocument();
    });

    it('Does not render button for next line when current line is the last incomplete line', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.testRepertoire.withSingleWhiteLine,
        });
        render(<TrainerPage />);

        expect(
            screen.queryByRole('button', { name: /next line/i })
        ).not.toBeInTheDocument();
    });

    it('Shows progress out of current loaded lines', () => {
        const testRepertoire = helpers.testRepertoire.withManyMixedLines;
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: testRepertoire,
        });
        render(<TrainerPage />);
        expect(
            screen.getByText(
                new RegExp(
                    `1/${Object.values(testRepertoire.lines).length}`,
                    'i'
                )
            )
        ).toBeInTheDocument();
    });
});

describe('Position after moves', () => {
    describe('Click move', () => {
        it('Renders new position after correct move played', async () => {
            vi.mocked(useOutletContext).mockReturnValue({
                repertoire: helpers.testRepertoire.withSingleWhiteLine,
            });
            const user = userEvent.setup();
            render(<TrainerPage />);

            const d2Square = screen.getByRole('button', { name: 'd2 square' });
            const d4Square = screen.getByRole('button', { name: 'd4 square' });

            expect(
                within(d2Square).getByAltText('white pawn')
            ).toBeInTheDocument();
            expect(
                within(d4Square).queryByAltText('white pawn')
            ).not.toBeInTheDocument();

            await user.click(d2Square);
            await user.click(d4Square);

            expect(
                within(d2Square).queryByAltText('white pawn')
            ).not.toBeInTheDocument();
            expect(
                within(d4Square).getByAltText('white pawn')
            ).toBeInTheDocument();
        });

        it('Does not change rendered position if incorrect move played', async () => {
            vi.mocked(useOutletContext).mockReturnValue({
                repertoire: helpers.testRepertoire.withSingleWhiteLine,
            });
            const user = userEvent.setup();
            render(<TrainerPage />);

            const d2Square = screen.getByRole('button', { name: 'd2 square' });
            const d3Square = screen.getByRole('button', { name: 'd3 square' });

            await user.click(d2Square);
            await user.click(d3Square);

            expect(
                within(d2Square).getByAltText('white pawn')
            ).toBeInTheDocument();
            expect(
                within(d3Square).queryByAltText('white pawn')
            ).not.toBeInTheDocument();
        });
    });

    describe('Drag move', () => {
        it('Renders new position after correct move played', async () => {
            vi.mocked(useOutletContext).mockReturnValue({
                repertoire: helpers.testRepertoire.withSingleWhiteLine,
            });
            const user = userEvent.setup();
            render(<TrainerPage />);

            const d2Square = screen.getByRole('button', { name: 'd2 square' });
            const d4Square = screen.getByRole('button', { name: 'd4 square' });

            expect(
                within(d2Square).getByAltText('white pawn')
            ).toBeInTheDocument();
            expect(
                within(d4Square).queryByAltText('white pawn')
            ).not.toBeInTheDocument();

            await user.pointer([
                { keys: '[MouseLeft>]', target: d2Square },
                { target: d4Square },
                { keys: '[/MouseLeft]' },
            ]);

            expect(
                within(d2Square).queryByAltText('white pawn')
            ).not.toBeInTheDocument();
            expect(
                within(d4Square).getByAltText('white pawn')
            ).toBeInTheDocument();
        });

        it('Does not change rendered position if incorrect move played', async () => {
            vi.mocked(useOutletContext).mockReturnValue({
                repertoire: helpers.testRepertoire.withSingleWhiteLine,
            });
            const user = userEvent.setup();
            render(<TrainerPage />);

            const d2Square = screen.getByRole('button', { name: 'd2 square' });
            const d6Square = screen.getByRole('button', { name: 'd6 square' });

            await user.pointer([
                { keys: '[MouseLeft>]', target: d2Square },
                { target: d6Square },
                { keys: '[/MouseLeft]' },
            ]);

            expect(
                within(d2Square).getByAltText('white pawn')
            ).toBeInTheDocument();
            expect(
                within(d6Square).queryByAltText('white pawn')
            ).not.toBeInTheDocument();
        });
    });
});

describe('Success feedback', () => {
    it('Renders incorrect move message if incorrect move played', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.testRepertoire.withSingleWhiteLine,
        });
        const user = userEvent.setup();
        render(<TrainerPage />);

        const d2Square = screen.getByRole('button', { name: 'd2 square' });
        const d3Square = screen.getByRole('button', { name: 'd3 square' });

        await user.click(d2Square);
        await user.click(d3Square);
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });

    it('Removes incorrect move message when board is clicked', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.testRepertoire.withSingleWhiteLine,
        });
        const user = userEvent.setup();
        render(<TrainerPage />);

        const d2Square = screen.getByRole('button', { name: 'd2 square' });
        const d3Square = screen.getByRole('button', { name: 'd3 square' });

        await user.click(d2Square);
        await user.click(d3Square);
        await user.click(d3Square);
        expect(screen.queryByText(/incorrect/i)).not.toBeInTheDocument();
    });

    it('Renders congratulatory message when line is completed', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.testRepertoire.withManyMixedLines,
        });
        const user = userEvent.setup();
        render(<TrainerPage />);

        const congratulatoryMessage = /well done/i;

        const d2Square = screen.getByRole('button', { name: 'd2 square' });
        const d4Square = screen.getByRole('button', { name: 'd4 square' });

        await user.click(d2Square);
        await user.click(d4Square);
        expect(
            screen.queryByText(congratulatoryMessage)
        ).not.toBeInTheDocument();

        const c2Square = screen.getByRole('button', { name: 'c2 square' });
        const c4Square = screen.getByRole('button', { name: 'c4 square' });

        await user.click(c2Square);
        await user.click(c4Square);
        expect(screen.getByText(congratulatoryMessage)).toBeInTheDocument();
    });
});

describe('Progress', () => {
    it('Increments progress counter when "next line" button clicked', async () => {
        const testRepertoire = helpers.testRepertoire.withManyMixedLines;
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: testRepertoire,
        });
        const user = userEvent.setup();
        render(<TrainerPage />);

        const nextButton = screen.getByRole('button', { name: /next line/i });
        await user.click(nextButton);
        expect(
            screen.getByText(
                new RegExp(
                    `2/${Object.values(testRepertoire.lines).length}`,
                    'i'
                )
            )
        ).toBeInTheDocument();
    });
});
