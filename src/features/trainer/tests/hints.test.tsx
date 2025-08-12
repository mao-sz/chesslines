import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { helpers, UUIDS } from '@/testing/helpers';
import { routes } from '@/app/routes';

vi.mock('@/util/util.ts', async (importActual) => ({
    ...(await importActual()),
    toShuffled: vi.fn((lines) => lines),
}));

function renderRouter() {
    const testRouter = createMemoryRouter(routes, {
        initialEntries: ['/trainer'],
    });
    render(<RouterProvider router={testRouter} />);
}

describe('Piece hint button', () => {
    it('Shows name of piece to move when clicked', async () => {
        const user = userEvent.setup();
        helpers.setup.trainer(helpers.testRepertoire.forHintsTesting, [
            UUIDS.lines[0],
            UUIDS.lines[1],
        ]);
        renderRouter();

        const nextLineButton = screen.getByRole('button', {
            name: /next line/i,
        });
        const hintsButton = screen.getByRole('button', { name: /hint/i });
        await user.click(hintsButton);
        expect(screen.getByText(/pawn move/i)).toBeInTheDocument();

        await user.click(nextLineButton);

        // fresh component on a new line
        const newHintsButton = screen.getByRole('button', { name: /hint/i });
        await user.click(newHintsButton);
        expect(screen.getByText(/knight move/i)).toBeInTheDocument();
    });

    it('Does not render if line is complete', async () => {
        const user = userEvent.setup();
        helpers.setup.trainer(helpers.testRepertoire.forHintsTesting, [
            UUIDS.lines[0],
            UUIDS.lines[1],
        ]);
        renderRouter();

        const d7Square = screen.getByRole('button', { name: /d7/i });
        const d5Square = screen.getByRole('button', { name: /d5/i });

        await user.click(d7Square);
        await user.click(d5Square);

        expect(
            screen.queryByRole('button', { name: /hint/i })
        ).not.toBeInTheDocument();
    });
});

describe('Notes button', () => {
    it('Shows notes for current move when clicked', async () => {
        const user = userEvent.setup();
        helpers.setup.trainer(helpers.testRepertoire.forHintsTesting, [
            UUIDS.lines[0],
            UUIDS.lines[1],
        ]);
        renderRouter();

        const nextLineButton = screen.getByRole('button', {
            name: /next line/i,
        });
        const notesButton = screen.getByRole('button', { name: /notes/i });
        await user.click(notesButton);
        expect(screen.getByText(/symmetrical/i)).toBeInTheDocument();

        await user.click(nextLineButton);

        // fresh component on a new line
        const newNotesButton = screen.getByRole('button', { name: /notes/i });
        await user.click(newNotesButton);
        expect(screen.getByText(/indian defense/i)).toBeInTheDocument();
    });

    it('Does not render if the current move does not have any notes', async () => {
        helpers.setup.trainer(helpers.testRepertoire.withSingleWhiteLine, [
            UUIDS.lines[0],
        ]);
        renderRouter();

        expect(
            screen.queryByRole('button', { name: /notes/i })
        ).not.toBeInTheDocument();
    });
});
