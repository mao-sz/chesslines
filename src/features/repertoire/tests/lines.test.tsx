import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { RepertoirePage } from '../RepertoirePage';
import { helpers, UUIDS } from '@/testing/helpers';

describe('Lines panel', () => {
    it('Opens lines folder in line panel when clicked on', async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage repertoire={helpers.repertoire.withLineInWhite} />
        );

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
        await user.click(whiteFolder);

        expect(
            screen.getByRole('region', {
                name: helpers.repertoire.withLineInWhite.folders.w.name,
            })
        ).toBeInTheDocument();
    });

    it("Lists open lines folder's lines in line panel", async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage repertoire={helpers.repertoire.withLineInWhite} />
        );

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
        await user.click(whiteFolder);

        const line = helpers.repertoire.withLineInWhite.lines[UUIDS.lines[0]];
        expect(
            screen.getByRole('list', { name: /lines/i })
        ).toBeInTheDocument();
        expect(screen.getByText(new RegExp(line.PGN))).toBeInTheDocument();
    });

    it("Shows starting FEN as 'Standard' if standard starting position", async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage repertoire={helpers.repertoire.withLineInWhite} />
        );

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
        await user.click(whiteFolder);

        expect(screen.getByText(/standard/i)).toBeInTheDocument();
    });

    it('Shows non-standard starting FEN in full', async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage
                repertoire={helpers.repertoire.withNonstandardLineInWhite}
            />
        );

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
        await user.click(whiteFolder);

        const line =
            helpers.repertoire.withNonstandardLineInWhite.lines[UUIDS.lines[0]];
        expect(
            screen.getByText(new RegExp(line.startingFEN))
        ).toBeInTheDocument();
    });

    it('Does not render new line button if open folder contains other folders', async () => {
        const user = userEvent.setup();
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        // open White folder in panel (opens because it could contain lines)
        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
        await user.click(whiteFolder);

        expect(
            screen.getByRole('button', { name: /new line/i })
        ).toBeInTheDocument();

        const newFolderButton = within(whiteFolder).getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const newFolderNameInput = screen.getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'new folder name[Enter]');

        expect(
            screen.queryByRole('button', { name: /new line/i })
        ).not.toBeInTheDocument();
    });
});

describe('Line editor', () => {
    async function openLineFolderInPanel(user: UserEvent) {
        render(
            <RepertoirePage repertoire={helpers.repertoire.withLineInWhite} />
        );

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
        await user.click(whiteFolder);
    }

    it('Opens line editor with current line FEN/PGN when line clicked on', async () => {
        const user = userEvent.setup();
        await openLineFolderInPanel(user);

        const lineList = screen.getByRole('list', { name: /lines/i });
        const lineItem = lineList.firstElementChild as HTMLLIElement;
        await user.click(lineItem);

        const lineEditor = await screen.findByRole('dialog');
        const line = helpers.repertoire.withLineInWhite.lines[UUIDS.lines[0]];

        expect(lineEditor).toBeInTheDocument();
        expect(
            within(lineEditor).getByDisplayValue(new RegExp(line.startingFEN))
        ).toBeInTheDocument();
        expect(
            within(lineEditor).getByDisplayValue(new RegExp(line.PGN))
        ).toBeInTheDocument();
    });

    it('Opens line editor with empty FEN/PGN sections when new line button clicked', async () => {
        const user = userEvent.setup();
        await openLineFolderInPanel(user);

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        const lineEditor = await screen.findByRole('dialog');
        const startingFENInput = within(lineEditor).getByRole('textbox', {
            name: /starting FEN/i,
        }) as HTMLInputElement;
        const PGNTextarea = within(lineEditor).getByRole('textbox', {
            name: /PGN/i,
        }) as HTMLTextAreaElement;

        expect(startingFENInput).toHaveValue('');
        expect(PGNTextarea).toHaveValue('');
    });

    it("Updates existing line's starting FEN and PGN after submitting form", async () => {
        const newStartingFEN =
            'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2';
        const newPGN = '2. Nc3';

        const user = userEvent.setup();
        await openLineFolderInPanel(user);

        const lineList = screen.getByRole('list', { name: /lines/i });
        const lineItem = lineList.firstElementChild as HTMLLIElement;
        await user.click(lineItem);

        const lineEditor = await screen.findByRole('dialog');
        const FENInput = within(lineEditor).getByRole('textbox', {
            name: /starting fen/i,
        });
        const PGNTextarea = within(lineEditor).getByRole('textbox', {
            name: /pgn/i,
        });
        const submitButton = within(lineEditor).getByRole('button', {
            name: /save/i,
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
            screen.getByText(
                new RegExp(`^Starting FEN: ${newStartingFEN}$`, 'i')
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(new RegExp(`^PGN: ${newPGN}$`, 'i'))
        ).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });

    it('Creates new line when submitting form for new line', async () => {
        const newStartingFEN =
            'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
        const newPGN = '1. d4 d5 2. c4';

        const user = userEvent.setup();
        await openLineFolderInPanel(user);

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        const lineEditor = await screen.findByRole('dialog');
        const FENInput = within(lineEditor).getByRole('textbox', {
            name: /starting fen/i,
        });
        const PGNTextarea = within(lineEditor).getByRole('textbox', {
            name: /pgn/i,
        });
        const submitButton = within(lineEditor).getByRole('button', {
            name: /save/i,
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
            screen.getByText(
                new RegExp(`^Starting FEN: ${newStartingFEN}$`, 'i')
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(new RegExp(`^PGN: ${newPGN}$`, 'i'))
        ).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
});
