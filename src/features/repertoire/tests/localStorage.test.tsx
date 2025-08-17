import {
    createMemoryRouter,
    useOutletContext,
    RouterProvider,
} from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import { helpers, UUIDS } from '@/testing/helpers';
import { LOCAL_STORAGE } from '@/util/localStorage';
import { EMPTY_REPERTOIRE, STANDARD_STARTING_FEN } from '@/util/constants';
import { routes } from '@/app/routes';

vi.mock('react-router', { spy: true });

const repertoireGetSpy = vi.spyOn(LOCAL_STORAGE.repertoire, 'get');
const repertoireSetSpy = vi.spyOn(LOCAL_STORAGE.repertoire, 'set');
const trainableLineIDsGetSpy = vi.spyOn(LOCAL_STORAGE.lineIDsToTrain, 'get');
const trainableLineIDsSetSpy = vi.spyOn(LOCAL_STORAGE.lineIDsToTrain, 'set');
const spyRandomUUID = vi.spyOn(crypto, 'randomUUID');
function getLatestUUID() {
    return spyRandomUUID.mock.results.at(-1)?.value;
}

function renderRouter() {
    const testRouter = createMemoryRouter(routes);
    render(<RouterProvider router={testRouter} />);
}

describe('App start', () => {
    it('Sets empty repertoire if no repertoire in local storage', () => {
        renderRouter();

        expect(repertoireGetSpy).toHaveReturnedWith({
            validationError: null,
            repertoire: null,
        });
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ repertoire: EMPTY_REPERTOIRE })
        );
    });

    it('Sets repertoire parsed from local storage if valid', () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.repertoire.withNestedFolders
        );

        renderRouter();

        expect(repertoireGetSpy).toHaveReturnedWith({
            validationError: null,
            repertoire: testRepertoire,
        });
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ repertoire: testRepertoire })
        );
    });

    it.each([
        [
            'obviously not repertoire string',
            '"foobar"',
            '✖ Invalid input: expected object, received string',
        ],
        [
            'missing "b" folder',
            '{"folders":{"w":{"name":"White","contains":"folders","children":[]}},"lines":{}}',
            '✖ Invalid input: expected object, received undefined\n  → at folders.b',
        ],
        [
            'syntax error',
            '{"folders":{"w":{"name":"White","contains":"either","children":[]},"b":{"name":"Black","contains":"either","children":[]}},"lines":{}',
            'There was a syntax error in the stored repertoire data',
        ],
    ])(
        'Renders repertoire error page if local storage repertoire string is not valid (%s)',
        (_, repertoireString, errorMessage) => {
            window.localStorage.setItem('repertoire', repertoireString);

            renderRouter();

            expect(repertoireGetSpy).toHaveReturnedWith({
                validationError: errorMessage,
                repertoire: repertoireString,
            });
            expect(vi.mocked(useOutletContext)).not.toHaveBeenCalled();
            expect(
                screen.getByRole('form', { name: /invalid repertoire data/i })
            ).toBeInTheDocument();
            expect(
                screen.getByText(errorMessage, { collapseWhitespace: false })
            ).toBeInTheDocument();
            expect(
                screen.getByText(repertoireString, {
                    collapseWhitespace: false,
                })
            ).toBeInTheDocument();
        }
    );

    it('Sets empty array if no trainable line IDs in local storage', () => {
        renderRouter();

        expect(trainableLineIDsGetSpy).toHaveReturnedWith([]);
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ repertoire: EMPTY_REPERTOIRE })
        );
    });

    it('Sets empty array if trainable line IDs in local storage is not an array of UUIDs', () => {
        window.localStorage.setItem(
            'line_ids_to_train',
            JSON.stringify(['foo', 234, {}])
        );

        renderRouter();

        expect(trainableLineIDsGetSpy).toHaveReturnedWith([]);
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ repertoire: EMPTY_REPERTOIRE })
        );
    });

    it('Sets trainable line IDs parsed from local storage if valid', () => {
        const testLineIDs = helpers.setup.trainableLineIDs([
            UUIDS.lines[0],
            UUIDS.lines[1],
        ]);

        renderRouter();

        expect(trainableLineIDsGetSpy).toHaveReturnedWith(testLineIDs);
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ lineIDsToTrain: testLineIDs })
        );
    });
});

describe('Editing repertoire', () => {
    it('Sets updated repertoire after adding folder', async () => {
        helpers.setup.repertoire(EMPTY_REPERTOIRE);
        const user = userEvent.setup();
        renderRouter();

        const newFolderButton = screen.getByRole('button', {
            name: /new white folder/i,
        });
        await user.click(newFolderButton);
        await user.keyboard('added[Space]folder[Enter]');

        const newFolderUUID = getLatestUUID();
        const updatedRepertoire = structuredClone(EMPTY_REPERTOIRE);
        updatedRepertoire.folders[newFolderUUID] = {
            name: 'added folder',
            contains: 'either',
            children: [],
        };
        updatedRepertoire.folders.w.children = [newFolderUUID];

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after deleting folder', async () => {
        helpers.setup.repertoire(helpers.repertoire.withFolderInWhite);
        const user = userEvent.setup();
        renderRouter();

        const deleteFolderButton = screen.getByRole('button', {
            name: /delete folder/i,
        });
        await user.click(deleteFolderButton);

        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        await user.click(confirmButton);

        expect(repertoireSetSpy).toHaveBeenCalledWith(EMPTY_REPERTOIRE);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(EMPTY_REPERTOIRE)
        );
    });

    it('Sets updated repertoire after renaming folder', async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.repertoire.withFolderInWhite
        );

        const user = userEvent.setup();
        renderRouter();

        const renameFolderButton = screen.getByRole('button', {
            name: /rename folder/i,
        });
        await user.click(renameFolderButton);
        await user.clear(screen.getByRole('textbox'));
        await user.keyboard('renamed[Enter]');

        const updatedRepertoire = structuredClone(testRepertoire);
        updatedRepertoire.folders[UUIDS.folders[0]].name = 'renamed';

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after adding line', async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.repertoire.withFolderInWhite
        );

        const user = userEvent.setup();
        renderRouter();

        const folder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(folder);

        const newLineLink = screen.getByRole('link', { name: /new line/i });
        await user.click(newLineLink);

        // setting starting position
        const loadPositionButton = screen.getByRole('button', {
            name: /load/i,
        });
        await user.click(loadPositionButton);

        // saving line
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        const newLineUUID = getLatestUUID();
        const updatedRepertoire = structuredClone(testRepertoire);
        updatedRepertoire.lines[newLineUUID] = {
            player: 'w',
            startingFEN: STANDARD_STARTING_FEN,
            PGN: '',
            notes: [''],
        };
        updatedRepertoire.folders[UUIDS.folders[0]].contains = 'lines';
        updatedRepertoire.folders[UUIDS.folders[0]].children = [newLineUUID];

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after editing line', async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.testRepertoire.withSingleWhiteLine
        );

        const user = userEvent.setup();
        renderRouter();

        const folder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(folder);

        const editLineLink = screen.getAllByRole('link', {
            name: /edit line/i,
        })[0];
        await user.click(editLineLink);

        const d7Square = screen.getByRole('button', { name: /d7/i });
        const d5Square = screen.getByRole('button', { name: /d5/i });

        await user.click(d7Square);
        await user.click(d5Square);
        const saveButtonForEdit = screen.getByRole('button', { name: /save/i });
        await user.click(saveButtonForEdit);

        const updatedRepertoire = structuredClone(testRepertoire);
        updatedRepertoire.lines[UUIDS.lines[0]] = {
            player: 'w',
            startingFEN: STANDARD_STARTING_FEN,
            PGN: '1. d4 d5',
            notes: ['', '', ''],
        };

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after deleting line', async () => {
        helpers.setup.repertoire(helpers.repertoire.withLineInWhite);
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child folder in lines panel/i,
        });
        await user.click(lineFolder);

        const deleteLineButton = screen.getByRole('button', {
            name: /delete line/i,
        });
        await user.click(deleteLineButton);

        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        await user.click(confirmButton);

        expect(repertoireSetSpy).toHaveBeenCalledWith(
            helpers.repertoire.withFolderInWhite
        );
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(helpers.repertoire.withFolderInWhite)
        );
    });
});

describe('Selecting lines to train', () => {
    it('Sets updated trainable line IDs after selecting lines', async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.testRepertoire.withManyMixedLines
        );
        const testLines = testRepertoire.folders[UUIDS.folders[0]].children;

        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child of white folder in lines panel/i,
        });
        await user.click(lineFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);
        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith([testLines[0]]);

        await user.click(lines[1]);
        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith(testLines);

        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify(testLines)
        );
    });

    it('Sets updated trainable line IDs after selecting all lines in a folder at once', async () => {
        const testRepertoire = helpers.setup.repertoire(
            helpers.testRepertoire.withManyMixedLines
        );
        const user = userEvent.setup();
        renderRouter();

        const lineFolderUUID = UUIDS.folders[0];
        const lineFolder = screen.getByRole('button', {
            name: /open child of white folder in lines panel/i,
        });
        await user.click(lineFolder);

        const selectAllLinesButton = screen.getByRole('button', {
            name: /select all/i,
        });
        await user.click(selectAllLinesButton);

        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith(
            testRepertoire.folders[lineFolderUUID].children
        );
        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify(testRepertoire.folders[lineFolderUUID].children)
        );
    });

    it('Sets updated trainable line IDs after de-selecting line', async () => {
        helpers.setup.repertoire(helpers.testRepertoire.withManyMixedLines);
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child of white folder in lines panel/i,
        });
        await user.click(lineFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);
        await user.click(lines[1]);
        await user.click(lines[0]);

        const deselectedLineUUID = UUIDS.lines[2];

        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith([
            deselectedLineUUID,
        ]);
        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify([deselectedLineUUID])
        );
    });

    it('Removes trainable line ID when line is deleted', async () => {
        helpers.setup.repertoire(helpers.testRepertoire.withManyMixedLines);
        const user = userEvent.setup();
        renderRouter();

        const lineFolder = screen.getByRole('button', {
            name: /open child of white folder in lines panel/i,
        });
        await user.click(lineFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);
        await user.click(lines[1]);

        const deleteFirstLineButton = screen.getAllByRole('button', {
            name: /delete line/i,
        })[0];
        await user.click(deleteFirstLineButton);

        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        await user.click(confirmButton);

        const deletedLineUUID = UUIDS.lines[2];

        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith([deletedLineUUID]);
        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify([deletedLineUUID])
        );
    });
});
