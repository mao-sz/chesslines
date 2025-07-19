import { useOutletContext } from 'react-router';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrainerPage } from './TrainerPage';
import { helpers } from '@/testing/helpers';

beforeEach(() => {
    vi.mocked(useOutletContext).mockReturnValue({
        repertoire: helpers.repertoire.manyFoldersAndLines,
    });
});
afterEach(vi.restoreAllMocks);
vi.mock('react-router');

describe('Initial elements', () => {
    it('Renders 8x8 chessboard with pieces', () => {
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
        render(<TrainerPage lines={helpers.lines.singleMove.b} />);

        const squares = screen.getAllByRole('button', { name: /square$/i });
        expect(squares.at(0)?.ariaLabel).toBe('h1 square');
        expect(squares.at(-1)?.ariaLabel).toBe('a8 square');
        expect(
            within(squares.at(-1)!).getByAltText('black rook')
        ).toBeInTheDocument();
    });

    it('Renders button for next line when incomplete lines remain after current line', () => {
        render(<TrainerPage lines={helpers.lines.multiLines.twoLines} />);

        expect(
            screen.getByRole('button', { name: /next line/i })
        ).toBeInTheDocument();
    });

    it('Does not render button for next line when current line is the last incomplete line', () => {
        render(<TrainerPage lines={helpers.lines.singleMove.w} />);

        expect(
            screen.queryByRole('button', { name: /next line/i })
        ).not.toBeInTheDocument();
    });

    it('Shows progress out of current loaded lines', () => {
        render(<TrainerPage lines={helpers.lines.multiLines.twoLines} />);
        expect(screen.getByText(/1\/2/)).toBeInTheDocument();

        cleanup();

        render(<TrainerPage lines={helpers.lines.multiLines.tenLines} />);
        expect(screen.queryByText(/1\/2/)).not.toBeInTheDocument();
        expect(screen.getByText(/1\/10/)).toBeInTheDocument();
    });
});

describe('Position after moves', () => {
    describe('Click move', () => {
        it('Renders new position after correct move played', async () => {
            const user = userEvent.setup();
            render(<TrainerPage lines={helpers.lines.singleMove.w} />);

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
            const user = userEvent.setup();
            render(<TrainerPage lines={helpers.lines.singleMove.w} />);

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
            const user = userEvent.setup();
            render(<TrainerPage lines={helpers.lines.singleMove.w} />);

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
            const user = userEvent.setup();
            render(<TrainerPage lines={helpers.lines.singleMove.w} />);

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
        const user = userEvent.setup();
        render(<TrainerPage lines={helpers.lines.singleMove.w} />);

        const d2Square = screen.getByRole('button', { name: 'd2 square' });
        const d3Square = screen.getByRole('button', { name: 'd3 square' });

        await user.click(d2Square);
        await user.click(d3Square);
        expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
    });

    it('Removes incorrect move message when board is clicked', async () => {
        const user = userEvent.setup();
        render(<TrainerPage lines={helpers.lines.singleMove.w} />);

        const d2Square = screen.getByRole('button', { name: 'd2 square' });
        const d3Square = screen.getByRole('button', { name: 'd3 square' });

        await user.click(d2Square);
        await user.click(d3Square);
        await user.click(d3Square);
        expect(screen.queryByText(/incorrect/i)).not.toBeInTheDocument();
    });

    it('Renders congratulatory message when line is completed', async () => {
        const user = userEvent.setup();
        render(<TrainerPage lines={helpers.lines.multiMove.w} />);

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
        const user = userEvent.setup();
        render(<TrainerPage lines={helpers.lines.multiLines.twoLines} />);

        const nextButton = screen.getByRole('button', { name: /next line/i });
        await user.click(nextButton);
        expect(screen.getByText(/2\/2/)).toBeInTheDocument();
    });
});
