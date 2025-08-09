import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { helpers, UUIDS } from '@/testing/helpers';
import { routes } from '@/app/routes';

vi.mock('@/util/util.ts', async (importActual) => ({
    ...(await importActual()),
    toShuffled: vi.fn((lines) => lines),
}));

const testRouter = createMemoryRouter(routes, { initialEntries: ['/trainer'] });

describe('Initial elements', () => {
    it('Renders 8x8 chessboard with pieces', () => {
        helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
            UUIDS.lines[0],
        ]);
        render(<RouterProvider router={testRouter} />);

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
        helpers.setup.trainer(helpers.testRepertoire.withSingleBlackLine, [
            UUIDS.lines[0],
        ]);
        render(<RouterProvider router={testRouter} />);

        const squares = screen.getAllByRole('button', { name: /square$/i });
        expect(squares.at(0)?.ariaLabel).toBe('h1 square');
        expect(squares.at(-1)?.ariaLabel).toBe('a8 square');
        expect(
            within(squares.at(-1)!).getByAltText('black rook')
        ).toBeInTheDocument();
    });

    it("Renders board when line's movelist starts with a black move", () => {
        helpers.setup.trainer(
            helpers.testRepertoire.withSingleBlackMidwayLine,
            [UUIDS.lines[0]]
        );
        render(<RouterProvider router={testRouter} />);

        const squares = screen.getAllByRole('button', { name: /square$/i });
        expect(squares.at(0)?.ariaLabel).toBe('h1 square');
        expect(squares.at(-1)?.ariaLabel).toBe('a8 square');
        expect(
            within(squares.at(-1)!).getByAltText('black rook')
        ).toBeInTheDocument();
    });

    it('Renders button for next line when incomplete lines remain after current line', () => {
        helpers.setup.trainer(helpers.testRepertoire.withManyMixedLines, [
            UUIDS.lines[0],
            UUIDS.lines[1],
        ]);
        render(<RouterProvider router={testRouter} />);

        expect(
            screen.getByRole('button', { name: /next line/i })
        ).toBeInTheDocument();
    });

    it('Does not render button for next line when current line is the last incomplete line', () => {
        helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
            UUIDS.lines[0],
        ]);
        render(<RouterProvider router={testRouter} />);

        expect(
            screen.queryByRole('button', { name: /next line/i })
        ).not.toBeInTheDocument();
    });

    it('Shows progress out of current loaded lines', () => {
        const [_, testedLineIDs] = helpers.setup.trainer(
            helpers.testRepertoire.withManyMixedLines,
            [UUIDS.lines[0], UUIDS.lines[1]]
        );
        render(<RouterProvider router={testRouter} />);
        expect(
            screen.getByText(new RegExp(`1/${testedLineIDs.length}`, 'i'))
        ).toBeInTheDocument();
    });

    it('Renders "No lines" message if no test lines loaded', () => {
        helpers.setup.trainer(helpers.repertoire.empty, []);
        render(<RouterProvider router={testRouter} />);

        const backToRepertoireButton = screen.getByRole('link', {
            name: /set lines to train from your repertoire/i,
        });

        // should not render a chessboard!
        expect(
            screen.queryAllByRole('button', { name: /square$/i })
        ).toHaveLength(0);
        expect(screen.getByText(/no lines to train/i)).toBeInTheDocument();
        expect(backToRepertoireButton).toBeInTheDocument();
        expect(backToRepertoireButton).toHaveAttribute('href', '/repertoire');
    });

    it.each([
        [
            helpers.testRepertoire.withSingleWhiteLine,
            'a8 square r / b8 square n / c8 square b / d8 square q / e8 square k / f8 square b / g8 square n / h8 square r / a7 square p / b7 square p / c7 square p / d7 square p / e7 square p / f7 square p / g7 square p / h7 square p / a6 square null / b6 square null / c6 square null / d6 square null / e6 square null / f6 square null / g6 square null / h6 square null / a5 square null / b5 square null / c5 square null / d5 square null / e5 square null / f5 square null / g5 square null / h5 square null / a4 square null / b4 square null / c4 square null / d4 square null / e4 square null / f4 square null / g4 square null / h4 square null / a3 square null / b3 square null / c3 square null / d3 square null / e3 square null / f3 square null / g3 square null / h3 square null / a2 square P / b2 square P / c2 square P / d2 square P / e2 square P / f2 square P / g2 square P / h2 square P / a1 square R / b1 square N / c1 square B / d1 square Q / e1 square K / f1 square B / g1 square N / h1 square R',
        ],
        [
            helpers.testRepertoire.withSingleBlackLine,
            'h1 square R / g1 square N / f1 square B / e1 square K / d1 square Q / c1 square B / b1 square N / a1 square R / h2 square P / g2 square P / f2 square P / e2 square P / d2 square null / c2 square P / b2 square P / a2 square P / h3 square null / g3 square null / f3 square null / e3 square null / d3 square null / c3 square null / b3 square null / a3 square null / h4 square null / g4 square null / f4 square null / e4 square null / d4 square P / c4 square null / b4 square null / a4 square null / h5 square null / g5 square null / f5 square null / e5 square null / d5 square null / c5 square null / b5 square null / a5 square null / h6 square null / g6 square null / f6 square null / e6 square null / d6 square null / c6 square null / b6 square null / a6 square null / h7 square p / g7 square p / f7 square p / e7 square p / d7 square p / c7 square p / b7 square p / a7 square p / h8 square r / g8 square n / f8 square b / e8 square k / d8 square q / c8 square b / b8 square n / a8 square r',
        ],
        [
            helpers.testRepertoire.withSingleWhiteMidwayLine,
            'a8 square r / b8 square null / c8 square b / d8 square q / e8 square k / f8 square b / g8 square n / h8 square r / a7 square p / b7 square p / c7 square null / d7 square p / e7 square p / f7 square p / g7 square p / h7 square p / a6 square null / b6 square null / c6 square n / d6 square null / e6 square null / f6 square null / g6 square null / h6 square null / a5 square null / b5 square null / c5 square p / d5 square null / e5 square null / f5 square null / g5 square null / h5 square null / a4 square null / b4 square null / c4 square null / d4 square null / e4 square P / f4 square null / g4 square null / h4 square null / a3 square null / b3 square null / c3 square N / d3 square null / e3 square null / f3 square null / g3 square null / h3 square null / a2 square P / b2 square P / c2 square P / d2 square P / e2 square null / f2 square P / g2 square P / h2 square P / a1 square R / b1 square null / c1 square B / d1 square Q / e1 square K / f1 square B / g1 square N / h1 square R',
        ],
        [
            helpers.testRepertoire.withSingleBlackMidwayLine,
            'h1 square R / g1 square N / f1 square B / e1 square K / d1 square Q / c1 square B / b1 square N / a1 square R / h2 square P / g2 square P / f2 square P / e2 square null / d2 square P / c2 square P / b2 square P / a2 square P / h3 square null / g3 square null / f3 square null / e3 square null / d3 square null / c3 square null / b3 square null / a3 square null / h4 square null / g4 square null / f4 square null / e4 square P / d4 square null / c4 square null / b4 square null / a4 square null / h5 square null / g5 square null / f5 square null / e5 square null / d5 square null / c5 square null / b5 square null / a5 square null / h6 square null / g6 square null / f6 square null / e6 square null / d6 square null / c6 square null / b6 square null / a6 square null / h7 square p / g7 square p / f7 square p / e7 square p / d7 square p / c7 square p / b7 square p / a7 square p / h8 square r / g8 square n / f8 square b / e8 square k / d8 square q / c8 square b / b8 square n / a8 square r',
        ],
    ])(
        "Ensures initial loaded position is the position before the player's first move",
        (repertoire, initialRenderedPosition) => {
            helpers.setup.trainer(repertoire, [UUIDS.lines[0]]);
            render(<RouterProvider router={testRouter} />);
            expect(helpers.serialiseCurrentBoard().join(' / ')).toBe(
                initialRenderedPosition
            );
        }
    );
});

describe('Position after moves', () => {
    describe('Click move', () => {
        it('Renders new position after correct move played', async () => {
            const user = userEvent.setup();
            helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
                UUIDS.lines[0],
            ]);
            render(<RouterProvider router={testRouter} />);

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
            helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
                UUIDS.lines[0],
            ]);
            render(<RouterProvider router={testRouter} />);

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
            helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
                UUIDS.lines[0],
            ]);
            render(<RouterProvider router={testRouter} />);

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
            helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
                UUIDS.lines[0],
            ]);
            render(<RouterProvider router={testRouter} />);

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
        helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
            UUIDS.lines[0],
        ]);
        render(<RouterProvider router={testRouter} />);

        const d2Square = screen.getByRole('button', { name: 'd2 square' });
        const d3Square = screen.getByRole('button', { name: 'd3 square' });

        await user.click(d2Square);
        await user.click(d3Square);
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });

    it('Removes incorrect move message when board is clicked', async () => {
        const user = userEvent.setup();
        helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
            UUIDS.lines[0],
        ]);
        render(<RouterProvider router={testRouter} />);

        const d2Square = screen.getByRole('button', { name: 'd2 square' });
        const d3Square = screen.getByRole('button', { name: 'd3 square' });

        await user.click(d2Square);
        await user.click(d3Square);
        await user.click(d3Square);
        expect(screen.queryByText(/incorrect/i)).not.toBeInTheDocument();
    });

    it('Renders congratulatory message when line is completed', async () => {
        const user = userEvent.setup();
        helpers.setup.trainer(helpers.testRepertoire.withManyMixedLines, [
            UUIDS.lines[0],
            UUIDS.lines[1],
        ]);
        render(<RouterProvider router={testRouter} />);

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
        const [_, testedLineIDs] = helpers.setup.trainer(
            helpers.testRepertoire.withManyMixedLines,
            [UUIDS.lines[0], UUIDS.lines[1]]
        );
        render(<RouterProvider router={testRouter} />);

        const nextButton = screen.getByRole('button', { name: /next line/i });
        await user.click(nextButton);
        expect(
            screen.getByText(new RegExp(`2/${testedLineIDs.length}`, 'i'))
        ).toBeInTheDocument();
    });
});
