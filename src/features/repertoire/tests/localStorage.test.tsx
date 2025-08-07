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

const testRouter = createMemoryRouter(routes);

describe('App start', () => {
    it('Sets empty repertoire if no repertoire in local storage', () => {
        render(<RouterProvider router={testRouter} />);

        expect(repertoireGetSpy).toHaveReturnedWith({
            validationError: null,
            repertoire: null,
        });
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ repertoire: EMPTY_REPERTOIRE })
        );
    });

    it('Sets repertoire parsed from local storage if valid', () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.repertoire.withNestedFolders
        );

        render(<RouterProvider router={testRouter} />);

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
            '{"folders":{"w":{"name":"White","contains":"either","children":[]}},"lines":{}}',
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

            render(<RouterProvider router={testRouter} />);

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
        render(<RouterProvider router={testRouter} />);

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

        render(<RouterProvider router={testRouter} />);

        expect(trainableLineIDsGetSpy).toHaveReturnedWith([]);
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ repertoire: EMPTY_REPERTOIRE })
        );
    });

    it('Sets trainable line IDs parsed from local storage if valid', () => {
        const testLineIDs = helpers.setUpTestTrainableLineIDs([
            UUIDS.lines[0],
            UUIDS.lines[1],
        ]);

        render(<RouterProvider router={testRouter} />);

        expect(trainableLineIDsGetSpy).toHaveReturnedWith(testLineIDs);
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith(
            expect.objectContaining({ lineIDsToTrain: testLineIDs })
        );
    });
});

describe('Editing repertoire', () => {
    it('Sets updated repertoire after adding folder', async () => {
        window.localStorage.setItem(
            'repertoire',
            JSON.stringify(EMPTY_REPERTOIRE)
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
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
        updatedRepertoire.folders.w.contains = 'folders';
        updatedRepertoire.folders.w.children = [newFolderUUID];

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after deleting folder', async () => {
        window.localStorage.setItem(
            'repertoire',
            JSON.stringify(EMPTY_REPERTOIRE)
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);
        await user.keyboard('added[Space]folder[Enter]');

        const deleteFolderButton = screen.getByRole('button', {
            name: /delete folder/i,
        });
        await user.click(deleteFolderButton);

        expect(repertoireSetSpy).toHaveBeenCalledWith(EMPTY_REPERTOIRE);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(EMPTY_REPERTOIRE)
        );
    });

    it('Sets updated repertoire after renaming folder', async () => {
        window.localStorage.setItem(
            'repertoire',
            JSON.stringify(EMPTY_REPERTOIRE)
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const renameFolderButton = screen.getByRole('button', {
            name: /rename folder/i,
        });
        await user.click(renameFolderButton);
        await user.clear(screen.getByRole('textbox'));
        await user.keyboard('renamed[Enter]');

        const updatedRepertoire = structuredClone(EMPTY_REPERTOIRE);
        updatedRepertoire.folders.w.name = 'renamed';

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after adding line', async () => {
        window.localStorage.setItem(
            'repertoire',
            JSON.stringify(EMPTY_REPERTOIRE)
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        // setting starting position
        const loadPositionButton = screen.getByRole('button', {
            name: /load/i,
        });
        await user.click(loadPositionButton);

        // saving line
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        const newFolderUUID = getLatestUUID();
        const updatedRepertoire = structuredClone(EMPTY_REPERTOIRE);
        updatedRepertoire.lines[newFolderUUID] = {
            player: 'w',
            startingFEN: STANDARD_STARTING_FEN,
            PGN: '',
            notes: [''],
        };
        updatedRepertoire.folders.w.contains = 'lines';
        updatedRepertoire.folders.w.children = [newFolderUUID];

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after editing line', async () => {
        window.localStorage.setItem(
            'repertoire',
            JSON.stringify(EMPTY_REPERTOIRE)
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        // setting starting position
        const loadPositionButton = screen.getByRole('button', {
            name: /load/i,
        });
        await user.click(loadPositionButton);

        // saving line
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);
        const newFolderUUID = getLatestUUID();

        const editLineButton = screen.getAllByRole('button', {
            name: /edit line/i,
        })[0];
        await user.click(editLineButton);

        const d2Square = screen.getByRole('button', { name: /d2/i });
        const d4Square = screen.getByRole('button', { name: /d4/i });

        await user.click(d2Square);
        await user.click(d4Square);
        const saveButtonForEdit = screen.getByRole('button', { name: /save/i });
        await user.click(saveButtonForEdit);

        const updatedRepertoire = structuredClone(EMPTY_REPERTOIRE);
        updatedRepertoire.lines[newFolderUUID] = {
            player: 'w',
            startingFEN: STANDARD_STARTING_FEN,
            PGN: '1. d4',
            notes: ['', ''],
        };
        updatedRepertoire.folders.w.contains = 'lines';
        updatedRepertoire.folders.w.children = [newFolderUUID];

        expect(repertoireSetSpy).toHaveBeenCalledWith(updatedRepertoire);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(updatedRepertoire)
        );
    });

    it('Sets updated repertoire after deleting line', async () => {
        window.localStorage.setItem(
            'repertoire',
            JSON.stringify(EMPTY_REPERTOIRE)
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        // setting starting position
        const loadPositionButton = screen.getByRole('button', {
            name: /load/i,
        });
        await user.click(loadPositionButton);

        // saving line
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        const deleteLineButton = screen.getByRole('button', {
            name: /delete line/i,
        });
        await user.click(deleteLineButton);

        expect(repertoireSetSpy).toHaveBeenCalledWith(EMPTY_REPERTOIRE);
        expect(window.localStorage.getItem('repertoire')).toBe(
            JSON.stringify(EMPTY_REPERTOIRE)
        );
    });
});

describe('Selecting lines to train', () => {
    it('Sets updated trainable line IDs after selecting lines', async () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.testRepertoire.withManyMixedLines
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);
        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith([
            testRepertoire.folders.w.children[0],
        ]);

        await user.click(lines[1]);
        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith([
            testRepertoire.folders.w.children[0],
            testRepertoire.folders.w.children[1],
        ]);

        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify([
                testRepertoire.folders.w.children[0],
                testRepertoire.folders.w.children[1],
            ])
        );
    });

    it('Sets updated trainable line IDs after selecting all lines in a folder at once', async () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.testRepertoire.withManyMixedLines
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const selectAllLinesButton = screen.getByRole('button', {
            name: /select all/i,
        });
        await user.click(selectAllLinesButton);

        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith(
            testRepertoire.folders.w.children
        );
        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify(testRepertoire.folders.w.children)
        );
    });

    it('Sets updated trainable line IDs after de-selecting line', async () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.testRepertoire.withManyMixedLines
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);
        await user.click(lines[1]);
        await user.click(lines[0]);

        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith([
            testRepertoire.folders.w.children[1],
        ]);

        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify([testRepertoire.folders.w.children[1]])
        );
    });

    it('Removes trainable line ID when line is deleted', async () => {
        const testRepertoire = helpers.setUpTestRepertoire(
            helpers.testRepertoire.withManyMixedLines
        );

        const user = userEvent.setup();
        render(<RouterProvider router={testRouter} />);

        const whiteFolder = screen.getByRole('button', {
            name: /open white folder in lines panel/i,
        });
        await user.click(whiteFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);
        await user.click(lines[1]);

        const deleteFirstLineButton = screen.getAllByRole('button', {
            name: /delete line/i,
        })[0];
        await user.click(deleteFirstLineButton);

        expect(trainableLineIDsSetSpy).toHaveBeenCalledWith([
            testRepertoire.folders.w.children[1],
        ]);

        expect(window.localStorage.getItem('line_ids_to_train')).toBe(
            JSON.stringify([testRepertoire.folders.w.children[1]])
        );
    });
});
