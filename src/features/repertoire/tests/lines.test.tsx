import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@/app/routes';
import { helpers, UUIDS } from '@/testing/helpers';

function renderRouter() {
    const testRouter = createMemoryRouter(routes);
    render(<RouterProvider router={testRouter} />);
}

describe('Lines panel', () => {
    it('Opens lines folder in line panel when clicked on', async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.repertoire.withLineInWhite
        );
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(lineFolder);

        expect(
            screen.getByRole('region', {
                name: testRepertoire.folders[UUIDS.folders[0]].name,
            })
        ).toBeInTheDocument();
    });

    it("Lists open linesFolder's lines in line panel", async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.repertoire.withLineInWhite
        );
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(lineFolder);

        const line = testRepertoire.lines[UUIDS.lines[0]];
        expect(
            screen.getByRole('list', { name: /lines/i })
        ).toBeInTheDocument();
        expect(screen.getByText(new RegExp(line.PGN))).toBeInTheDocument();
    });

    it('Displays special text for lines with empty PGNs', async () => {
        helpers.setup.repertoire(helpers.repertoire.withBlankLineInWhite);
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(lineFolder);

        expect(screen.getByText(/no moves set/i)).toBeInTheDocument();
    });

    it('Does not show starting FEN if standard starting position', async () => {
        helpers.setup.repertoire(helpers.repertoire.withLineInWhite);
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(lineFolder);

        expect(
            screen.queryByText(/custom starting fen:/i)
        ).not.toBeInTheDocument();
    });

    it('Shows non-standard starting FEN in full', async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.repertoire.withNonstandardLineInWhite
        );
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(lineFolder);

        const line = testRepertoire.lines[UUIDS.lines[0]];
        expect(screen.getByText(line.startingFEN)).toBeInTheDocument();
    });

    it('Does not render new line link if open folder contains other folders', async () => {
        helpers.setup.repertoire(helpers.repertoire.withFolderInWhite);
        const user = userEvent.setup();
        renderRouter();

        const emptyFolder = screen.getByRole('listitem', {
            name: /child closed folder/i,
        });

        // open White folder in panel (opens because it could contain lines)
        const emptyFolderOpenButton = within(emptyFolder).getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(emptyFolderOpenButton);

        expect(
            screen.getByRole('link', { name: /new line/i })
        ).toBeInTheDocument();

        const newFolderButton = within(emptyFolder).getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const newFolderNameInput = screen.getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'new folder name[Enter]');

        expect(
            screen.queryByRole('link', { name: /new line/i })
        ).not.toBeInTheDocument();
    });
});
