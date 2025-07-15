import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
