import {
    createMemoryRouter,
    useOutletContext,
    RouterProvider,
} from 'react-router';
import { describe, it, expect, afterEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { helpers } from '@/testing/helpers';
import { LOCAL_STORAGE } from '@/util/localStorage';
import { EMPTY_REPERTOIRE, STANDARD_STARTING_FEN } from '@/util/constants';
import { routes } from '@/app/routes';

vi.mock('react-router', { spy: true });

const repertoireGetSpy = vi.spyOn(LOCAL_STORAGE.repertoire, 'get');
const repertoireSetSpy = vi.spyOn(LOCAL_STORAGE.repertoire, 'set');
const spyRandomUUID = vi.spyOn(crypto, 'randomUUID');
function getLatestUUID() {
    return spyRandomUUID.mock.results.at(-1)?.value;
}

afterEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
});

const testRouter = createMemoryRouter(routes);

describe('App start', () => {
    it('Sets empty repertoire if no repertoire in local storage', () => {
        render(<RouterProvider router={testRouter} />);

        expect(repertoireGetSpy).toHaveReturnedWith(null);
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith({
            repertoire: EMPTY_REPERTOIRE,
        });
    });

    it('Sets repertoire parsed from local storage if valid', () => {
        const TEST_REPERTOIRE = helpers.repertoire.withNestedFolders;
        window.localStorage.setItem(
            'repertoire',
            JSON.stringify(TEST_REPERTOIRE)
        );

        render(<RouterProvider router={testRouter} />);

        expect(repertoireGetSpy).toHaveReturnedWith(TEST_REPERTOIRE);
        expect(vi.mocked(useOutletContext)).toHaveReturnedWith({
            repertoire: TEST_REPERTOIRE,
        });
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

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
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

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
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

        const newLine = screen.getByRole('list', { name: /lines/i })
            .firstElementChild as HTMLElement;
        await user.click(newLine);

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

        const whiteFolder = screen.getByRole('generic', {
            name: /white.*folder/i,
        }).firstElementChild as HTMLElement;
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
