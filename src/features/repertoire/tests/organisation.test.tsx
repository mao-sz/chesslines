import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepertoirePage } from '../RepertoirePage';
import { helpers } from '@/testing/helpers';
import { convert } from '@/util/util';

describe('Moving folders', () => {
    it('Moves folder inside another folder when dropped on it', async () => {
        render(
            <RepertoirePage
                repertoire={helpers.repertoire.manyFoldersAndLines}
            />
        );

        const lineFolder = screen.getByRole('generic', {
            name: /^line folder/i,
        });
        const folderFolder = screen.getByRole('generic', {
            name: /folder folder/i,
        });
        expect(folderFolder).not.toContainElement(lineFolder);

        fireEvent.drag(lineFolder);
        fireEvent.drop(folderFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.idToUuid(lineFolder.id)}`,
            },
        });
        expect(folderFolder).toContainElement(
            screen.getByRole('generic', { name: /^line folder/i })
        );
    });

    it('Does nothing if folder is not released on valid drop target', async () => {
        render(
            <RepertoirePage
                repertoire={helpers.repertoire.manyFoldersAndLines}
            />
        );

        const lineFolder = screen.getByRole('generic', {
            name: /^line folder/i,
        });
        const folderFolder = screen.getByRole('generic', {
            name: /folder folder/i,
        });

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(lineFolder);
        fireEvent.drop(document.body, {
            dataTransfer: {
                getData: () => `folder ${convert.idToUuid(lineFolder.id)}`,
            },
        });
        expect(folderFolder).not.toContainElement(
            screen.getByRole('generic', { name: /^line folder/i })
        );
    });

    it('Does nothing if the target folder contains lines', async () => {
        const { container } = render(
            <RepertoirePage
                repertoire={helpers.repertoire.manyFoldersAndLines}
            />
        );

        const lineFolder = screen.getByRole('generic', {
            name: /^line folder/i,
        });
        const folderFolder = screen.getByRole('generic', {
            name: /folder folder/i,
        });

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(folderFolder);
        fireEvent.drop(lineFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.idToUuid(folderFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.test.tsx.snap'
        );
    });

    it('Does nothing if dropped on the current direct parent folder', async () => {
        const { container } = render(
            <RepertoirePage
                repertoire={helpers.repertoire.manyFoldersAndLines}
            />
        );

        const lineFolder = screen.getByRole('generic', {
            name: /^line folder/i,
        });
        const whiteFolder = screen.getByRole('generic', { name: /white/i });

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(lineFolder);
        fireEvent.drop(whiteFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.idToUuid(lineFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.test.tsx.snap'
        );
    });

    it('Prevents dragging base colour folders', async () => {
        const { container } = render(
            <RepertoirePage
                repertoire={helpers.repertoire.manyFoldersAndLines}
            />
        );

        const folderFolder = screen.getByRole('generic', {
            name: /folder folder/i,
        });
        const whiteFolder = screen.getByRole('generic', { name: /white/i });

        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(whiteFolder);
        fireEvent.drop(folderFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.idToUuid(whiteFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.test.tsx.snap'
        );
    });

    it('Prevents dropping onto self', async () => {
        const { container } = render(
            <RepertoirePage
                repertoire={helpers.repertoire.manyFoldersAndLines}
            />
        );

        const folderFolder = screen.getByRole('generic', {
            name: /folder folder/i,
        });
        // user-events cannot simulate drag* events - must manually fire
        fireEvent.drag(folderFolder);
        fireEvent.drop(folderFolder, {
            dataTransfer: {
                getData: () => `folder ${convert.idToUuid(folderFolder.id)}`,
            },
        });
        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalFolderState.test.tsx.snap'
        );
    });
});

describe('Moving lines', () => {
    async function openLineFolder() {
        const user = userEvent.setup();
        const { container } = render(
            <RepertoirePage
                repertoire={helpers.repertoire.manyFoldersAndLines}
            />
        );
        const lineFolder = screen.getByRole('generic', {
            name: /^line folder/i,
        }).firstElementChild as HTMLElement;
        const folderFolder = screen.getByRole('generic', {
            name: /folder folder/i,
        }).firstElementChild as HTMLElement;
        await user.click(lineFolder);
        await user.click(folderFolder);

        return { user, container };
    }

    it('Moves line to within another lines folder when dropped on it', async () => {
        const { user } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;
        const targetLineFolder = screen.getByRole('generic', {
            name: /^another line folder/i,
        }).firstElementChild as HTMLElement;

        fireEvent.drag(lineToDrag);
        fireEvent.drop(targetLineFolder, {
            dataTransfer: {
                getData: () => `line ${convert.idToUuid(lineToDrag.id)}`,
            },
        });
        expect(
            screen.queryByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).not.toBeInTheDocument();

        await user.click(targetLineFolder);
        expect(
            screen.getByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).toBeInTheDocument();
    });

    it('Moves line to within an empty folder when dropped on it', async () => {
        const { user } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;
        const targetEmptyFolder = screen.getByRole('generic', {
            name: /^empty folder/i,
        }).firstElementChild as HTMLElement;

        fireEvent.drag(lineToDrag);
        fireEvent.drop(targetEmptyFolder, {
            dataTransfer: {
                getData: () => `line ${convert.idToUuid(lineToDrag.id)}`,
            },
        });
        expect(
            screen.queryByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).not.toBeInTheDocument();

        await user.click(targetEmptyFolder);
        expect(
            screen.getByText(/1\. e4 e5 2\. d4 d5 3\. f4 f5/i)
        ).toBeInTheDocument();
    });

    it('Does nothing if line is not released on valid drop target', async () => {
        const { container } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;

        fireEvent.drag(lineToDrag);
        fireEvent.drop(document.body, {
            dataTransfer: {
                getData: () => `line ${convert.idToUuid(lineToDrag.id)}`,
            },
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.test.tsx.snap'
        );
    });

    it('Does nothing if the target folder contains folders', async () => {
        const { container } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;
        const targetFolderFolder = screen.getByRole('generic', {
            name: /^folder folder/i,
        });

        fireEvent.drag(lineToDrag);
        fireEvent.drop(targetFolderFolder, {
            dataTransfer: {
                getData: () => `line ${convert.idToUuid(lineToDrag.id)}`,
            },
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.test.tsx.snap'
        );
    });

    it("Does nothing if dropped on the folder it's already in", async () => {
        const { container } = await openLineFolder();

        const linesPanel = screen.getByRole('list', { name: /lines/i });
        const lineToDrag = linesPanel.firstElementChild as HTMLElement;
        const originalParentFolder = screen.getByRole('generic', {
            name: /^line folder/i,
        });

        fireEvent.drag(lineToDrag);
        fireEvent.drop(originalParentFolder, {
            dataTransfer: {
                getData: () => `line ${convert.idToUuid(lineToDrag.id)}`,
            },
        });

        await expect(container).toMatchFileSnapshot(
            './__snapshots__/organisationOriginalLineState.test.tsx.snap'
        );
    });
});
