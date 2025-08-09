import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { helpers } from '@/testing/helpers';
import { convert } from '@/util/util';
import { routes } from '@/app/routes';

const testRouter = createMemoryRouter(routes);

describe('Moving folders', () => {
    it('Moves folder inside another folder when dropped on it', async () => {
        helpers.setup.repertoire(helpers.repertoire.manyFoldersAndLines);
        render(<RouterProvider router={testRouter} />);

        const lineFolder = screen.getByRole('listitem', {
            name: /^line folder/i,
        });
        const folderFolder = screen.getByRole('listitem', {
            name: /folder folder/i,
        });
        expect(folderFolder).not.toContainElement(lineFolder);

        fireEvent.drag(lineFolder);
        fireEvent.drop(folderFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.htmlIdToUuid(lineFolder.id)}`,
            },
        });
        expect(folderFolder).toContainElement(
            screen.getByRole('listitem', { name: /^line folder/i })
        );
    });

    it('Does nothing if folder is not released on valid drop target', async () => {
        helpers.setup.repertoire(helpers.repertoire.manyFoldersAndLines);
        const { container } = render(<RouterProvider router={testRouter} />);

        const lineFolder = screen.getByRole('listitem', {
            name: /^line folder/i,
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(lineFolder);
        fireEvent.drop(document.body, {
            dataTransfer: {
                getData: () => `folder ${convert.htmlIdToUuid(lineFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );
    });

    it('Does nothing if the target folder contains lines', async () => {
        helpers.setup.repertoire(helpers.repertoire.manyFoldersAndLines);
        const { container } = render(<RouterProvider router={testRouter} />);

        const lineFolder = screen.getByRole('listitem', {
            name: /^line folder/i,
        });
        const folderFolder = screen.getByRole('listitem', {
            name: /folder folder/i,
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(folderFolder);
        fireEvent.drop(lineFolder, {
            dataTransfer: {
                getData: () =>
                    `folder ${convert.htmlIdToUuid(folderFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );
    });

    it('Does nothing if dropped on the current direct parent folder', async () => {
        helpers.setup.repertoire(helpers.repertoire.manyFoldersAndLines);
        const { container } = render(<RouterProvider router={testRouter} />);

        const lineFolder = screen.getByRole('listitem', {
            name: /^line folder/i,
        });
        const whiteFolder = screen.getByRole('listitem', { name: /white/i });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(lineFolder);
        fireEvent.drop(whiteFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.htmlIdToUuid(lineFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );
    });

    it('Prevents dragging base colour folders', async () => {
        helpers.setup.repertoire(helpers.repertoire.manyFoldersAndLines);
        const { container } = render(<RouterProvider router={testRouter} />);

        const folderFolder = screen.getByRole('listitem', {
            name: /folder folder/i,
        });
        const whiteFolder = screen.getByRole('listitem', { name: /white/i });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(whiteFolder);
        fireEvent.drop(folderFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.htmlIdToUuid(whiteFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );
    });

    it('Prevents dropping onto self', async () => {
        helpers.setup.repertoire(helpers.repertoire.manyFoldersAndLines);
        const { container } = render(<RouterProvider router={testRouter} />);

        const folderFolder = screen.getByRole('listitem', {
            name: /folder folder/i,
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(folderFolder);
        fireEvent.drop(folderFolder, {
            dataTransfer: {
                getData: () =>
                    `folder ${convert.htmlIdToUuid(folderFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.html'
        );
    });
});

describe('Moving lines', () => {
    async function openLineFolder() {
        helpers.setup.repertoire(helpers.repertoire.manyFoldersAndLines);
        const user = userEvent.setup();
        const { container } = render(<RouterProvider router={testRouter} />);
        const lineFolder = screen.getByRole('button', {
            name: /open line folder folder in lines panel/i,
        });
        const folderFolder = screen.getByRole('button', {
            name: /open folder folder/i,
        });
        await user.click(lineFolder);
        await user.click(folderFolder);

        return { user, container };
    }

    it('Moves line to within another lines folder when dropped on it', async () => {
        const { user } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLLIElement;
        const targetLineFolder = screen.getByRole('listitem', {
            name: /^another line folder/i,
        });

        fireEvent.drag(lineToDrag);
        fireEvent.drop(targetLineFolder, {
            dataTransfer: {
                getData: () => `line ${convert.htmlIdToUuid(lineToDrag.id)}`,
            },
        });
        expect(
            screen.queryByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).not.toBeInTheDocument();

        const targetLineFolderOpenButton = within(targetLineFolder).getByRole(
            'button',
            { name: /open/i }
        );
        await user.click(targetLineFolderOpenButton);
        expect(
            screen.getByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).toBeInTheDocument();
    });

    it('Moves line to within an empty folder when dropped on it', async () => {
        const { user } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;
        const targetEmptyFolder = screen.getByRole('listitem', {
            name: /^empty folder/i,
        });

        fireEvent.drag(lineToDrag);
        fireEvent.drop(targetEmptyFolder, {
            dataTransfer: {
                getData: () => `line ${convert.htmlIdToUuid(lineToDrag.id)}`,
            },
        });
        expect(
            screen.queryByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).not.toBeInTheDocument();

        const targetEmptyFolderOpenButton = within(targetEmptyFolder).getByRole(
            'button',
            { name: /open/i }
        );
        await user.click(targetEmptyFolderOpenButton);
        expect(
            screen.getByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).toBeInTheDocument();
    });

    it('Does nothing if line is not released on valid drop target', async () => {
        const { container } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.html'
        );

        fireEvent.drag(lineToDrag);
        fireEvent.drop(document.body, {
            dataTransfer: {
                getData: () => `line ${convert.htmlIdToUuid(lineToDrag.id)}`,
            },
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.html'
        );
    });

    it('Does nothing if the target folder contains folders', async () => {
        const { container } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;
        const targetFolderFolder = screen.getByRole('listitem', {
            name: /^folder folder/i,
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.html'
        );

        fireEvent.drag(lineToDrag);
        fireEvent.drop(targetFolderFolder, {
            dataTransfer: {
                getData: () => `line ${convert.htmlIdToUuid(lineToDrag.id)}`,
            },
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.html'
        );
    });

    it("Does nothing if dropped on the folder it's already in", async () => {
        const { container } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;
        const originalParentFolder = screen.getByRole('listitem', {
            name: /^line folder/i,
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.html'
        );

        fireEvent.drag(lineToDrag);
        fireEvent.drop(originalParentFolder, {
            dataTransfer: {
                getData: () => `line ${convert.htmlIdToUuid(lineToDrag.id)}`,
            },
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.html'
        );
    });
});
