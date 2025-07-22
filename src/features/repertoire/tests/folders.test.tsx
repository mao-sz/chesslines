import {
    createMemoryRouter,
    RouterProvider,
    useOutletContext,
} from 'react-router';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { helpers } from '@/testing/helpers';
import { routes } from '@/app/routes';

afterEach(vi.resetAllMocks);
vi.mock('react-router', { spy: true });

const testRouter = createMemoryRouter(routes);

describe('Switching repertoire tabs', () => {
    it('Switches from white to black repertoire panels via tab buttons', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

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
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        render(<RouterProvider router={testRouter} />);

        expect(
            screen.getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
    });

    it("Renders 'new folder' button when folder contains folders", () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withFolderInWhite,
        });
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('generic', {
            name: /white open folder/i,
        }).firstElementChild as HTMLElement;

        expect(
            within(whiteFolder).getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            within(whiteFolder).queryByRole('button', { name: /new line/i })
        ).not.toBeInTheDocument();
    });

    it("Does not render 'new folder' button for a folder containing lines", () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withLineInWhite,
        });
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('generic', {
            name: /white.+folder/i,
        }).firstElementChild as HTMLElement;

        expect(
            within(whiteFolder).queryByRole('button', { name: /new folder/i })
        ).not.toBeInTheDocument();
    });

    it("Does not render any form for 'new folder' if button not clicked", () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        render(<RouterProvider router={testRouter} />);

        expect(
            screen.queryByRole('form', { name: /^new/i })
        ).not.toBeInTheDocument();
    });

    it('Removes new folder button when new folder button clicked and form appears', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

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
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withNestedFolders,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const closableFolder = screen.getByRole('generic', {
            name: /child closed folder$/i,
        });
        // open the first child folder
        await user.click(closableFolder.firstElementChild as HTMLElement);

        const newFolderButton = within(closableFolder).getAllByRole('button', {
            name: /new folder/i,
        })[0];
        await user.click(newFolderButton);
        await user.click(closableFolder);

        expect(closableFolder).toHaveAccessibleName(/child open folder$/i);
    });

    it('Adds new folder when new folder name submitted', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

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

    it('Replaces new folder name form with new folder button after submission', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const newFolderNameInput = screen.getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'new folder name[Enter]');

        // not the same ref as newFolderButton
        expect(
            within(whiteFolder).getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(newFolderNameInput).not.toBeInTheDocument();
    });

    it('Discards new folder name form without submitting and renders new folder button when cancel button clicked', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

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
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withFolderInWhite,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const closedFolder = screen.getByRole('generic', {
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
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withNestedFolders,
        });
        render(<RouterProvider router={testRouter} />);

        expect(
            screen.queryByRole('form', { name: /rename folder/i })
        ).not.toBeInTheDocument();
    });

    it('Shows rename form when edit button clicked', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const renameButton = screen.getByRole('button', {
            name: /rename folder/i,
        });
        await user.click(renameButton);

        expect(
            screen.getByRole('form', { name: /rename folder/i })
        ).toBeInTheDocument();
    });

    it('Renames folder when rename form submitted', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

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
            screen.getByRole('generic', { name: /^renamed folder/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('generic', { name: `${oldFolderName}` })
        ).not.toBeInTheDocument();
    });

    it('Prevents closing folder while rename form present', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withFolderInWhite,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const closableFolder = screen.getByRole('generic', {
            name: /white open folder$/i,
        });

        const renameButton = within(closableFolder).getAllByRole('button', {
            name: /rename folder/i,
        })[0];
        await user.click(renameButton);
        await user.click(closableFolder);

        expect(closableFolder).toHaveAccessibleName(/white open folder$/i);
    });

    it('Does not render new folder button when rename form present', async () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withFolderInWhite,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const renamableFolder = screen.getByRole('generic', {
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
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withFolderInWhite,
        });
        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const renamableFolder = screen.getByRole('generic', {
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
