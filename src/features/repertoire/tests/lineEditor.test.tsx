import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepertoirePage } from '../RepertoirePage';
import { helpers } from '@/testing/helpers';
import { STANDARD_STARTING_FEN } from '@/util/constants';
import type { Repertoire } from '@/types/repertoire';

async function openLineFolderInPanel(
    repertoire: Repertoire = helpers.repertoire.withLineInWhite
) {
    render(<RepertoirePage repertoire={repertoire} />);

    const user = userEvent.setup();
    const whiteFolder = screen.getByRole('generic', { name: /white.*folder/i })
        .firstElementChild as HTMLElement;
    await user.click(whiteFolder);
    return user;
}

async function openLineEditor(
    repertoire: Repertoire = helpers.repertoire.withLineInWhite
) {
    const user = await openLineFolderInPanel(repertoire);
    const lineList = screen.getByRole('list', { name: /lines/i });
    const firstLine = lineList.firstElementChild as HTMLLIElement;
    await user.click(firstLine);
    return user;
}

describe('Opening and interaction', () => {
    it('Opens line editor to board interface when line clicked on', async () => {
        await openLineEditor();

        const lineEditor = screen.getByRole('dialog');

        expect(lineEditor).toBeInTheDocument();
        const boardSquares = within(lineEditor).getAllByRole('button', {
            name: /square/i,
        });
        expect(boardSquares).toHaveLength(64);
    });

    it('Includes a list of moves in the board interface', async () => {
        await openLineEditor();

        const lineEditor = screen.getByRole('dialog');
        const moveList = within(lineEditor).getByRole('list', {
            name: /moves/i,
        });

        expect(moveList).toBeInTheDocument();
        expect(within(moveList).getByText('1.')).toBeInTheDocument();
        expect(
            within(moveList).getByRole('button', { name: /e4/i })
        ).toBeInTheDocument();
        expect(
            within(moveList).getByRole('button', { name: /e5/i })
        ).toBeInTheDocument();
    });

    it('Includes "notes" box in the board interface', async () => {
        await openLineEditor();

        expect(
            screen.getByRole('textbox', { name: /notes/i })
        ).toBeInTheDocument();
    });

    it('Displays current notes value as you type in it', async () => {
        const user = await openLineEditor();

        const textBox = screen.getByRole('textbox', { name: /notes/i });
        const randomTypedText = String(window.crypto.randomUUID());
        await user.type(textBox, randomTypedText);

        expect(
            within(textBox).getByText(new RegExp(`${randomTypedText}$`, 'i'))
        ).toBeInTheDocument();
    });

    it('Opens line editor with the FEN/PGN interface when new line button clicked', async () => {
        const user = await openLineFolderInPanel();

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        const lineEditor = screen.getByRole('dialog');
        const startingFENInput = within(lineEditor).getByRole('textbox', {
            name: /custom starting FEN/i,
        }) as HTMLInputElement;
        const PGNTextarea = within(lineEditor).getByRole('textbox', {
            name: /PGN/i,
        }) as HTMLTextAreaElement;

        expect(startingFENInput).toHaveValue('');
        expect(startingFENInput).toHaveAttribute(
            'placeholder',
            STANDARD_STARTING_FEN
        );
        expect(PGNTextarea).toHaveValue('');
    });

    it("Updates existing line's PGN after saving a line with new moves added", async () => {
        const user = await openLineFolderInPanel();

        const lineList = screen.getByRole('list', { name: /lines/i });
        const lineItem = lineList.firstElementChild as HTMLLIElement;

        expect(within(lineItem).queryByText(/d4/i)).not.toBeInTheDocument();

        await user.click(lineItem);

        const lineEditor = screen.getByRole('dialog');
        const submitButton = within(lineEditor).getByRole('button', {
            name: /save/i,
        });

        const d2Square = screen.getByRole('button', { name: /d2/i });
        const d4Square = screen.getByRole('button', { name: /d4/i });

        await user.click(d2Square);
        await user.click(d4Square);
        await user.click(submitButton);

        expect(within(lineItem).getByText(/d4/i)).toBeInTheDocument();
    });

    it('Can open a new editor dialog after closing the previous one', async () => {
        const user = await openLineFolderInPanel();

        const lineList = screen.getByRole('list', { name: /lines/i });
        const lineItem = lineList.firstElementChild as HTMLLIElement;
        await user.click(lineItem);

        const lineEditor = screen.getByRole('dialog');
        const closeEditorButton = within(lineEditor).getByRole('button', {
            name: /cancel/i,
        });
        await user.click(closeEditorButton);

        expect(lineEditor).not.toBeInTheDocument();

        await user.click(lineItem);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});

describe('Validation', () => {
    it('Creates new line when submitting valid FEN/PGN', async () => {
        const newStartingFEN =
            'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
        const newPGN = '1. d4 d5 2. c4';

        const user = await openLineFolderInPanel();

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.queryByText(`PGN: ${newPGN}`)).not.toBeInTheDocument();

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        const lineEditor = screen.getByRole('dialog');
        const FENInput = within(lineEditor).getByRole('textbox', {
            name: /starting fen/i,
        });
        const PGNTextarea = within(lineEditor).getByRole('textbox', {
            name: /pgn/i,
        });
        const submitButton = within(lineEditor).getByRole('button', {
            name: /load/i,
        });

        await user.type(
            FENInput,
            `{Control>}A{/Control}[Backspace]${newStartingFEN}`
        );
        await user.type(
            PGNTextarea,
            `{Control>}A{/Control}[Backspace]${newPGN}`
        );
        await user.click(submitButton); // switches to board interface

        // save in board interface
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText(`PGN: ${newPGN}`)).toBeInTheDocument();
    });

    it.each([
        [
            'invalid FEN passed',
            'rnbq2394jkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
            '1. d4 d5 2. exd5',
        ],
        [
            'PGN contains syntax errors',
            STANDARD_STARTING_FEN,
            '1. d4dsfjl3 d5 2. exd5',
        ],
        [
            'resulting game contains invalid moves',
            STANDARD_STARTING_FEN,
            '1. d4 d5 2. exd5',
        ],
    ])('Prevents FEN/PGN loading if %s', async (_, newStartingFEN, newPGN) => {
        const user = await openLineFolderInPanel();

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        const lineEditor = screen.getByRole('dialog');
        const FENInput = within(lineEditor).getByRole('textbox', {
            name: /starting fen/i,
        });
        const PGNTextarea = within(lineEditor).getByRole('textbox', {
            name: /pgn/i,
        });
        const submitButton = within(lineEditor).getByRole('button', {
            name: /load/i,
        });

        await user.type(
            FENInput,
            `{Control>}A{/Control}[Backspace]${newStartingFEN}`
        );
        await user.type(
            PGNTextarea,
            `{Control>}A{/Control}[Backspace]${newPGN}`
        );
        await user.click(submitButton);

        expect(
            screen.getByText(/invalid fen and\/or pgn combination/i)
        ).toBeInTheDocument();
    });

    it('Shows invalid FEN/PGN screen when opening editor for an invalid line', async () => {
        await openLineEditor(helpers.repertoire.withInvalidLineInWhite);

        const lineEditor = screen.getByRole('dialog');

        expect(lineEditor).toBeInTheDocument();
        expect(
            within(lineEditor).getByText(/invalid fen and\/or pgn combination/i)
        ).toBeInTheDocument();
        // should not load chessboard
        expect(
            within(lineEditor).queryAllByRole('button', { name: /square$/i })
        ).toHaveLength(0);
    });
});

describe('Move history navigation', () => {
    it('Opens existing line on latest position', async () => {
        await openLineEditor(helpers.repertoire.withLineInWhite);
        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).toHaveAttribute('data-contains', 'p');
    });

    it('Loads previous position when "previous" button clicked', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);
        const previousButton = screen.getByRole('button', {
            name: /previous/i,
        });
        await user.click(previousButton);

        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).not.toHaveAttribute('data-contains', 'p');

        await user.click(previousButton);

        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).not.toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).not.toHaveAttribute('data-contains', 'p');
    });

    it('Loads next position when "next" button clicked', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);
        const previousButton = screen.getByRole('button', {
            name: /previous/i,
        });
        const nextButton = screen.getByRole('button', { name: /next/i });
        await user.click(previousButton);
        await user.click(nextButton);

        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).toHaveAttribute('data-contains', 'p');
    });

    it('Loads initial position when "skip to first move" button clicked', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);
        const skipToFirstButton = screen.getByRole('button', {
            name: /skip to first move/i,
        });
        await user.click(skipToFirstButton);

        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).not.toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).not.toHaveAttribute('data-contains', 'p');
    });

    it('Loads latest position when "skip to last move" button clicked', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);
        const previousButton = screen.getByRole('button', {
            name: /previous/i,
        });
        const skipToLastButton = screen.getByRole('button', {
            name: /skip to last move/i,
        });
        await user.click(previousButton);
        await user.click(previousButton);
        await user.click(skipToLastButton);

        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).toHaveAttribute('data-contains', 'p');
    });

    it('Does nothing if on initial position and trying to go to previous move', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);
        const skipToFirstButton = screen.getByRole('button', {
            name: /skip to first move/i,
        });
        const previousButton = screen.getByRole('button', {
            name: /previous/i,
        });
        await user.click(skipToFirstButton);
        const initialPosition = helpers.serialiseCurrentBoard();

        await user.click(previousButton);
        const currentPosition = helpers.serialiseCurrentBoard();

        expect(currentPosition).toEqual(initialPosition);
    });

    it('Does nothing if on latest position and trying to go to next move', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);

        const latestPosition = helpers.serialiseCurrentBoard();
        const nextButton = screen.getByRole('button', { name: /next/i });
        await user.click(nextButton);
        const currentPosition = helpers.serialiseCurrentBoard();

        expect(currentPosition).toEqual(latestPosition);
    });

    it('Moves to nth move position when nth move button clicked', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);

        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).toHaveAttribute('data-contains', 'p');

        const firstMoveButton = screen.getByRole('button', {
            name: /full move 1\. e4/i,
        });
        await user.click(firstMoveButton);

        expect(
            screen.getByRole('button', { name: /e4 square/i })
        ).toHaveAttribute('data-contains', 'P');
        expect(
            screen.getByRole('button', { name: /e5 square/i })
        ).not.toHaveAttribute('data-contains', 'p');
    });

    it('Allows history navigation through newly entered moves', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);

        const initialLatestPosition = helpers.serialiseCurrentBoard();

        const d2Square = screen.getByRole('button', { name: /d2 square/i });
        const d4Square = screen.getByRole('button', { name: /d4 square/i });
        const previousButton = screen.getByRole('button', {
            name: /previous/i,
        });
        const nextButton = screen.getByRole('button', { name: /next/i });

        await user.click(d2Square);
        await user.click(d4Square);

        const nextLatestPosition = helpers.serialiseCurrentBoard();
        expect(nextLatestPosition).not.toEqual(initialLatestPosition);

        await user.click(previousButton);
        expect(helpers.serialiseCurrentBoard()).toEqual(initialLatestPosition);

        await user.click(nextButton);
        expect(helpers.serialiseCurrentBoard()).toEqual(nextLatestPosition);
    });

    it('Overwrites future moves if move played when not at latest move', async () => {
        const user = await openLineEditor(helpers.repertoire.withLineInWhite);

        const firstFullMove = screen.getByRole('listitem', {
            name: /full move 1\./i,
        });
        expect(firstFullMove.children[1]).toHaveAccessibleName(
            /black full move 1\. e5/i
        );

        const previousButton = screen.getByRole('button', {
            name: /previous/i,
        });
        await user.click(previousButton);

        const d7Square = screen.getByRole('button', { name: /d7 square/i });
        const d5Square = screen.getByRole('button', { name: /d5 square/i });
        await user.click(d7Square);
        await user.click(d5Square);

        expect(firstFullMove.children[1]).toHaveAccessibleName(
            /black full move 1\. d5/i
        );
    });

    it("Does not load old moves' notes after being overwritten", async () => {
        const user = await openLineEditor(helpers.repertoire.withLineWithNotes);

        const notesBox = screen.getByRole('textbox', {
            name: /notes/i,
        }) as HTMLTextAreaElement;
        const latestNoteText = notesBox.value;

        const previousButton = screen.getByRole('button', {
            name: /previous/i,
        });
        await user.click(previousButton);

        const d7Square = screen.getByRole('button', { name: /d7 square/i });
        const d5Square = screen.getByRole('button', { name: /d5 square/i });
        await user.click(d7Square);
        await user.click(d5Square);

        expect(
            within(notesBox).queryByText(latestNoteText)
        ).not.toBeInTheDocument();
    });
});
