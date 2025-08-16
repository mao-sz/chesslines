import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@/app/routes';
import { helpers } from '@/testing/helpers';
import { LOCAL_STORAGE } from '@/util/localStorage';
import type { Repertoire } from '@/types/repertoire';

// Must stub as cannot create spy for window.location.reload due to read-only nature of window.location
vi.stubGlobal('location', { reload: vi.fn() });
const repertoireSetSpy = vi.spyOn(LOCAL_STORAGE.repertoire, 'set');
const lineIDsToTrainSetSpy = vi.spyOn(LOCAL_STORAGE.lineIDsToTrain, 'set');

async function openImportDialog(repertoire: Repertoire) {
    const user = userEvent.setup();
    helpers.setup.repertoire(repertoire);
    const testRouter = createMemoryRouter(routes);
    render(<RouterProvider router={testRouter} />);

    const importButton = screen.getByRole('button', {
        name: /import repertoire/i,
    });
    await user.click(importButton);

    return user;
}

// Export hard to test since it's side effects only without any valuable spy/mock targets
describe('Import', () => {
    it('Opens import dialog when clicked', async () => {
        await openImportDialog(helpers.repertoire.empty);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('Opens on the text tab by default', async () => {
        await openImportDialog(helpers.repertoire.empty);
        expect(
            screen.getByRole('tabpanel', { name: /import from text/i })
        ).toBeInTheDocument();
    });

    it('Has form with textarea only in text tab', async () => {
        await openImportDialog(helpers.repertoire.empty);
        const importForm = screen.getByRole('form', { name: /import data/i });
        expect(
            within(importForm).getByRole('textbox', {
                name: /repertoire string/i,
            })
        ).toBeInTheDocument();

        // input[type="file"] does not have a default role
        // https://www.w3.org/TR/html-aria/#el-input-file
        expect(
            within(importForm).queryByLabelText(
                /repertoire file \(.json or .txt\)/i
            )
        ).not.toBeInTheDocument();
    });

    it('Has form with file input only in file tab', async () => {
        const user = await openImportDialog(helpers.repertoire.empty);
        const fileTab = screen.getByRole('tab', { name: /import from file/i });
        await user.click(fileTab);

        const importForm = screen.getByRole('form', { name: /import data/i });
        expect(
            within(importForm).queryByRole('textbox', {
                name: /repertoire string/i,
            })
        ).not.toBeInTheDocument();

        // input[type="file"] does not have a default role
        // https://www.w3.org/TR/html-aria/#el-input-file
        expect(
            within(importForm).getByLabelText(
                /repertoire file \(.json or .txt\)/i
            )
        ).toBeInTheDocument();
    });

    it('Saves valid repertoire string to local storage', async () => {
        const repertoireString =
            '{"folders":{"w":{"name":"White","contains":"folders","children":["68cafccd-d7b8-4f92-9153-9df59eee4f03"]},"b":{"name":"Black","contains":"folders","children":[]},"68cafccd-d7b8-4f92-9153-9df59eee4f03":{"name":"Child","contains":"folders","children":["68cafccd-d7b8-4f92-9153-9df59eee4f04"]},"68cafccd-d7b8-4f92-9153-9df59eee4f04":{"name":"Child of child","contains":"either","children":[]}},"lines":{}}';

        const user = await openImportDialog(helpers.repertoire.empty);
        const textarea = screen.getByRole('textbox', {
            name: /repertoire string/i,
        });
        const importButton = screen.getByRole('button', { name: /^import$/i });

        await user.type(
            textarea,
            helpers.escapeSpecialUserEventCharacters(repertoireString)
        );
        await user.click(importButton);

        expect(repertoireSetSpy).toHaveBeenCalledWith(repertoireString);
        expect(lineIDsToTrainSetSpy).toHaveBeenCalledWith([]);
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('Saves valid repertoire string from uploaded file to local storage', async () => {
        const repertoireString =
            '{"folders":{"w":{"name":"White","contains":"folders","children":["68cafccd-d7b8-4f92-9153-9df59eee4f03"]},"b":{"name":"Black","contains":"folders","children":[]},"68cafccd-d7b8-4f92-9153-9df59eee4f03":{"name":"Child","contains":"folders","children":["68cafccd-d7b8-4f92-9153-9df59eee4f04"]},"68cafccd-d7b8-4f92-9153-9df59eee4f04":{"name":"Child of child","contains":"either","children":[]}},"lines":{}}';

        const user = await openImportDialog(helpers.repertoire.empty);
        const fileTab = screen.getByRole('tab', { name: /import from file/i });
        await user.click(fileTab);

        const fileInput = screen.getByLabelText(
            /repertoire file \(.json or .txt\)/i
        ) as HTMLInputElement;
        // IMPORTANT! Bug in user-event where file inputs fail validation when required
        // https://github.com/testing-library/user-event/issues/801
        fileInput.required = false;
        const importButton = screen.getByRole('button', { name: /^import$/i });

        await user.upload(
            fileInput,
            new File([repertoireString], 'repertoire.txt', {
                type: 'text/plain',
            })
        );
        await user.click(importButton);

        expect(repertoireSetSpy).toHaveBeenCalledWith(repertoireString);
        expect(lineIDsToTrainSetSpy).toHaveBeenCalledWith([]);
        expect(window.location.reload).toHaveBeenCalled();
    });

    it.each([
        ['flobadobdob'],
        [
            // base w folder can only contain folders
            '{"folders":{"w":{"name":"White","contains":"lines","children":["5ce93b80-bb2d-4351-a6ef-c3582ef34e0c"]},"b":{"name":"Black","contains":"folders","children":["70dcfb82-002d-4dac-94f1-9f7954220a19"]},"70dcfb82-002d-4dac-94f1-9f7954220a19":{"name":"test","contains":"lines","children":["077e2625-bb27-465d-837e-f1a8a5df7ff4","0985f53d-03a8-4eb6-9f98-2b33e9455287"]}},"lines":{"077e2625-bb27-465d-837e-f1a8a5df7ff4":{"player":"b","startingFEN":"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1","PGN":"1... c5 2. d4 cxd4","notes":["","","",""]},"0985f53d-03a8-4eb6-9f98-2b33e9455287":{"player":"b","startingFEN":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","PGN":"1. d4 d5","notes":["","",""]},"5ce93b80-bb2d-4351-a6ef-c3582ef34e0c":{"player":"w","startingFEN":"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","PGN":"1. e4 e5 2. Nc3 Nc6 3. Bc4 Bc5 4. Qg4","notes":["","","","","","","","Yes!"]}}}',
        ],
    ])(
        'Invalidates invalid repertoire string data',
        async (repertoireString) => {
            const user = await openImportDialog(helpers.repertoire.empty);
            // ensure setup storage calls don't contaminate test
            vi.resetAllMocks();

            const fileTab = screen.getByRole('tab', {
                name: /import from file/i,
            });
            await user.click(fileTab);

            const fileInput = screen.getByLabelText(
                /repertoire file \(.json or .txt\)/i
            ) as HTMLInputElement;
            // IMPORTANT! Bug in user-event where file inputs fail validation when required
            // https://github.com/testing-library/user-event/issues/801
            fileInput.required = false;
            const importButton = screen.getByRole('button', {
                name: /^import$/i,
            });

            await user.upload(
                fileInput,
                new File([repertoireString], 'repertoire.txt', {
                    type: 'text/plain',
                })
            );
            await user.click(importButton);

            expect(repertoireSetSpy).not.toHaveBeenCalled();
            expect(lineIDsToTrainSetSpy).not.toHaveBeenCalled();
            expect(window.location.reload).not.toHaveBeenCalled();
            expect(
                screen.getByText(/invalid repertoire data/i)
            ).toBeInTheDocument();
        }
    );

    it('Removes validation error message when switching tabs', async () => {
        const user = await openImportDialog(helpers.repertoire.empty);

        const textarea = screen.getByRole('textbox', {
            name: /repertoire string/i,
        });
        const importButton = screen.getByRole('button', { name: /^import$/i });

        await user.type(textarea, 'flobadobdob');
        await user.click(importButton);

        const validationErrorMessage = /invalid repertoire data/i;
        expect(screen.getByText(validationErrorMessage)).toBeInTheDocument();

        const fileTabButton = screen.getByRole('tab', {
            name: /import from file/i,
        });
        await user.click(fileTabButton);

        expect(
            screen.queryByText(validationErrorMessage)
        ).not.toBeInTheDocument();
    });
});
