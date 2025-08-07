import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@/app/routes';
import { helpers, UUIDS } from '@/testing/helpers';

const testRouter = createMemoryRouter(routes);

describe('Lines panel', () => {
    it('Opens lines folder in line panel when clicked on', async () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.repertoire.withLineInWhite
        );
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        expect(
            screen.getByRole('region', { name: testRepertoire.folders.w.name })
        ).toBeInTheDocument();
    });

    it("Lists open lines folder's lines in line panel", async () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.repertoire.withLineInWhite
        );
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const line = testRepertoire.lines[UUIDS.lines[0]];
        expect(
            screen.getByRole('list', { name: /lines/i })
        ).toBeInTheDocument();
        expect(screen.getByText(new RegExp(line.PGN))).toBeInTheDocument();
    });

    it('Displays special text for lines with empty PGNs', async () => {
        helpers.setUpTestRepertoire(helpers.repertoire.withBlankLineInWhite);
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        expect(screen.getByText(/no moves set/i)).toBeInTheDocument();
    });

    it('Does not show starting FEN if standard starting position', async () => {
        helpers.setUpTestRepertoire(helpers.repertoire.withLineInWhite);
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        expect(
            screen.queryByText(/custom starting fen:/i)
        ).not.toBeInTheDocument();
    });

    it('Shows non-standard starting FEN in full', async () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.repertoire.withNonstandardLineInWhite
        );
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const line = testRepertoire.lines[UUIDS.lines[0]];
        expect(screen.getByText(line.startingFEN)).toBeInTheDocument();
    });

    it('Does not render new line button if open folder contains other folders', async () => {
        helpers.setUpTestRepertoire(helpers.repertoire.empty);
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('listitem', {
            name: /white.*folder/i,
        });

        // open White folder in panel (opens because it could contain lines)
        const whiteFolderOpenButton = within(whiteFolder).getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolderOpenButton);

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
