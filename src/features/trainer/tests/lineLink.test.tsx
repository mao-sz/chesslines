import {
    createMemoryRouter,
    useOutletContext,
    RouterProvider,
} from 'react-router';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { helpers } from '@/testing/helpers';
import { routes } from '@/app/routes';

afterEach(vi.resetAllMocks);
vi.mock('react-router', { spy: true });
vi.mock('@/util/util.ts', async (importActual) => ({
    ...(await importActual()),
    toShuffled: vi.fn((lines) => lines),
}));

const testRouter = createMemoryRouter(routes, { initialEntries: ['/trainer'] });

describe('"Study line" link', () => {
    it('Renders in trainer page', () => {
        const testRepertoire = helpers.testRepertoire.withSingleWhiteLine;
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: testRepertoire,
        });

        render(<RouterProvider router={testRouter} />);

        expect(
            screen.getByRole('link', { name: /open line in new tab/i })
        ).toBeInTheDocument();
    });

    it('Includes attributes to open specific line ID in a new tab', () => {
        const testRepertoire = helpers.testRepertoire.withSingleWhiteLine;
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: testRepertoire,
        });

        render(<RouterProvider router={testRouter} />);

        const testLineID = Object.keys(testRepertoire.lines)[0];
        const studyLineButton = screen.getByRole('link', {
            name: /open line in new tab/i,
        });

        expect(studyLineButton).toHaveAttribute('target', '_blank');
        expect(studyLineButton).toHaveAttribute('rel', 'noopener');
        expect(studyLineButton).toHaveAttribute(
            'href',
            `/repertoire?line=${testLineID}`
        );
    });

    it('"line" query param automatically opens line\'s parent folder in the line panel', async () => {
        const testRepertoire = helpers.testRepertoire.withSingleWhiteLine;
        const testLineParentFolder = testRepertoire.folders.w;
        const testLineID = Object.keys(testRepertoire.lines)[0];
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: testRepertoire,
        });
        const studyLineRouter = createMemoryRouter(routes, {
            initialEntries: [`/repertoire?line=${testLineID}`],
        });

        render(<RouterProvider router={studyLineRouter} />);

        expect(
            screen.getByRole('region', { name: testLineParentFolder.name })
        ).toBeInTheDocument();
    });

    it('"line" query param automatically opens line editor with matching line', async () => {
        const testRepertoire = helpers.testRepertoire.withSingleWhiteLine;
        const testLineID = Object.keys(testRepertoire.lines)[0];
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: testRepertoire,
        });
        const studyLineRouter = createMemoryRouter(routes, {
            initialEntries: [`/repertoire?line=${testLineID}`],
        });

        render(<RouterProvider router={studyLineRouter} />);

        const lineEditor = screen.getByRole('dialog');
        expect(
            within(lineEditor).getByRole('button', {
                name: /white full move 1\. d4/i,
            })
        ).toBeInTheDocument();
    });
});
