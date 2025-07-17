import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
