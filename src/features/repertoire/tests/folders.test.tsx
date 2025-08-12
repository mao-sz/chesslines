import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { helpers } from '@/testing/helpers';
import { routes } from '@/app/routes';

function renderRouter() {
    const testRouter = createMemoryRouter(routes);
    render(<RouterProvider router={testRouter} />);
}

describe('Switching repertoire tabs', () => {
    it('Switches from white to black repertoire panels via tab buttons', async () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        const user = userEvent.setup();
        renderRouter();

        const whiteTabButton = screen.getByRole('tab', {
            name: /white repertoire/i,
        });
        const blackTabButton = screen.getByRole('tab', {
            name: /black repertoire/i,
        });

        await user.click(blackTabButton);

        expect(whiteTabButton.ariaSelected).toBe('false');
        expect(blackTabButton.ariaSelected).toBe('true');

        expect(
            screen.queryByRole('tabpanel', { name: /white repertoire/i })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole('tabpanel', { name: /black repertoire/i })
        ).toBeInTheDocument();
    });
});

describe('New folder button', () => {
    it("Renders 'new folder' button when folder is empty", () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        renderRouter();

        expect(
            screen.getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
    });

    it("Renders 'new folder' button when folder contains folders", () => {
        helpers.setup.repertoire(helpers.repertoire.withFolderInWhite);
        renderRouter();

        const whiteFolder = screen.getByRole('listitem', {
            name: /white open folder/i,
        });

        expect(
            within(whiteFolder).getAllByRole('button', {
                name: /new folder/i,
            })[0]
        ).toBeInTheDocument();
    });

    it("Does not render 'new folder' button for a folder containing lines", () => {
        helpers.setup.repertoire(helpers.repertoire.withLineInWhite);
        renderRouter();

        const whiteFolder = screen.getByRole('listitem', {
            name: /white.+folder/i,
        });

        expect(
            within(whiteFolder).queryByRole('button', { name: /new folder/i })
        ).not.toBeInTheDocument();
    });

    it("Does not render any form for 'new folder' if button not clicked", () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        renderRouter();

        expect(
            screen.queryByRole('form', { name: /^new/i })
        ).not.toBeInTheDocument();
    });

    it('Removes new folder button when new folder button clicked and form appears', async () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        const user = userEvent.setup();
        renderRouter();

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        expect(newFolderButton).not.toBeInTheDocument();
        expect(
            screen.getByRole('form', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('textbox', { name: /name/i })
        ).toBeInTheDocument();
    });

    it('Prevents a folder from being closed if new folder name form present', async () => {
        helpers.setup.repertoire(helpers.repertoire.withNestedFolders);
        const user = userEvent.setup();
        renderRouter();

        const closableFolder = screen.getByRole('listitem', {
            name: /child closed folder$/i,
        });
        const closableFolderOpenButton = within(closableFolder).getByRole(
            'button',
            { name: /open child folder/i }
        );
        // open the first child folder
        await user.click(closableFolderOpenButton);

        const newFolderButton = within(closableFolder).getAllByRole('button', {
            name: /new folder/i,
        })[0];
        await user.click(newFolderButton);
        await user.click(closableFolder);

        expect(closableFolder).toHaveAccessibleName(/child open folder$/i);
    });

    it('Adds new folder when new folder name submitted', async () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        const user = userEvent.setup();
        renderRouter();

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const newFolderNameInput = screen.getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'new folder name[Enter]');

        expect(
            screen.getByRole('heading', { name: /new folder name/i })
        ).toBeInTheDocument();
    });

    it('Discards new folder name form without submitting and renders new folder button when cancel button clicked', async () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        const user = userEvent.setup();
        renderRouter();

        const displayedFolderCount = screen.queryAllByRole('generic', {
            name: /folder$/i,
        }).length;

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        // not the same ref as newFolderButton
        expect(
            screen.getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            screen.queryAllByRole('generic', { name: /folder$/i })
        ).toHaveLength(displayedFolderCount);
    });

    it('Auto-opens closed folder when new folder is added', async () => {
        helpers.setup.repertoire(helpers.repertoire.withFolderInWhite);
        const user = userEvent.setup();
        renderRouter();

        const closedFolder = screen.getByRole('listitem', {
            name: /closed folder$/i,
        });
        const newFolderButton = within(closedFolder).getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);
        const newFolderNameInput = within(closedFolder).getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'another new folder name[Enter]');

        expect(closedFolder).toHaveAccessibleName(/open folder$/i);
    });
});

describe('Renaming folder', () => {
    it('Does not render rename form by default', () => {
        helpers.setup.repertoire(helpers.repertoire.withNestedFolders);
        renderRouter();

        expect(
            screen.queryByRole('form', { name: /rename folder/i })
        ).not.toBeInTheDocument();
    });

    it('Shows rename form when edit button clicked', async () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        const user = userEvent.setup();
        renderRouter();

        const renameButton = screen.getByRole('button', {
            name: /rename folder/i,
        });
        await user.click(renameButton);

        expect(
            screen.getByRole('form', { name: /rename folder/i })
        ).toBeInTheDocument();
    });

    it('Renames folder when rename form submitted', async () => {
        helpers.setup.repertoire(helpers.repertoire.empty);
        const user = userEvent.setup();
        renderRouter();

        const oldFolderName = helpers.repertoire.empty.folders.w;
        const renameButton = screen.getByRole('button', {
            name: /rename folder/i,
        });
        await user.click(renameButton);

        const renameInput = screen.getByRole('textbox', { name: /name/i });
        await user.type(
            renameInput,
            '{Control>}A{/Control}[Backspace]renamed folder[Enter]'
        );

        expect(
            screen.getByRole('listitem', { name: /^renamed folder/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('listitem', { name: `${oldFolderName}` })
        ).not.toBeInTheDocument();
    });

    it('Prevents closing folder while rename form present', async () => {
        helpers.setup.repertoire(helpers.repertoire.withFolderInWhite);
        const user = userEvent.setup();
        renderRouter();

        const closableFolder = screen.getByRole('listitem', {
            name: /white open folder$/i,
        });
        const closableFolderCloseButton = within(closableFolder).getByRole(
            'button',
            { name: /close white folder/i }
        );

        const renameButton = within(closableFolder).getAllByRole('button', {
            name: /rename folder/i,
        })[0];
        await user.click(renameButton);
        await user.click(closableFolderCloseButton);

        expect(closableFolder).toHaveAccessibleName(/white open folder$/i);
    });

    it('Does not render new folder button when rename form present', async () => {
        helpers.setup.repertoire(helpers.repertoire.withFolderInWhite);
        const user = userEvent.setup();
        renderRouter();

        const renamableFolder = screen.getByRole('listitem', {
            name: /closed folder$/i,
        });

        const renameButton = within(renamableFolder).getByRole('button', {
            name: /rename folder/i,
        });
        await user.click(renameButton);

        expect(
            within(renamableFolder).queryByRole('button', {
                name: /^new folder$/i,
            })
        ).not.toBeInTheDocument();
    });

    it('Does not render delete folder button when rename form present', async () => {
        helpers.setup.repertoire(helpers.repertoire.withFolderInWhite);
        const user = userEvent.setup();
        renderRouter();

        const renamableFolder = screen.getByRole('listitem', {
            name: /closed folder$/i,
        });

        const renameButton = within(renamableFolder).getByRole('button', {
            name: /rename folder/i,
        });
        await user.click(renameButton);

        expect(
            within(renamableFolder).queryByRole('button', {
                name: /^delete folder$/i,
            })
        ).not.toBeInTheDocument();
    });
});
