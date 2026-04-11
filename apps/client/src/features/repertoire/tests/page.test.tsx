import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { routes } from '@/app/routes';
import { helpers } from '@/testing/helpers';
import userEvent from '@testing-library/user-event';

function renderRouter() {
    const testRouter = createMemoryRouter(routes);
    render(<RouterProvider router={testRouter} />);
}

describe('Initial elements', () => {
    it('Renders a button for each of white and black repertoires', () => {
        renderRouter();

        expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('Renders by default with the white repertoire tab panel showing only', () => {
        renderRouter();

        const whiteTabButton = screen.getByRole('tab', {
            name: /white repertoire/i,
        });
        const blackTabButton = screen.getByRole('tab', {
            name: /black repertoire/i,
        });
        expect(whiteTabButton.ariaSelected).toBe('true');
        expect(blackTabButton.ariaSelected).toBe('false');

        expect(
            screen.getByRole('tabpanel', { name: /white repertoire/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('tabpanel', { name: /black repertoire/i })
        ).not.toBeInTheDocument();
    });

    it('Renders an empty lines panel when first loaded', () => {
        renderRouter();

        expect(
            screen.getByRole('region', { name: /empty line panel/i })
        ).toBeInTheDocument();
    });

    it('Does not render selected line count in header if no lines selected', () => {
        renderRouter();
        expect(
            screen.getByRole('link', { name: /^trainer$/i })
        ).toBeInTheDocument();
    });

    it('Renders "(1)" in header trainer page link if 1 line selected', async () => {
        helpers.setup.repertoire(helpers.testRepertoire.withManyMixedLines);

        const user = userEvent.setup();
        renderRouter();

        const linesFolder = screen.getByRole('button', {
            name: /open child of white folder in lines panel/i,
        });
        await user.click(linesFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);

        expect(
            screen.getByRole('link', { name: /^trainer \(1\)$/i })
        ).toBeInTheDocument();
    });

    it('Renders "(2)" in header trainer page link if 2 lines selected', async () => {
        helpers.setup.repertoire(helpers.testRepertoire.withManyMixedLines);

        const user = userEvent.setup();
        renderRouter();

        const linesFolder = screen.getByRole('button', {
            name: /open child of white folder in lines panel/i,
        });
        await user.click(linesFolder);

        const lines = within(
            screen.getByRole('list', { name: /lines/i })
        ).getAllByRole('checkbox');

        await user.click(lines[0]);
        await user.click(lines[1]);

        expect(
            screen.getByRole('link', { name: /^trainer \(2\)$/i })
        ).toBeInTheDocument();
    });

    it('Renders an "Import repertoire" button', () => {
        renderRouter();
        expect(
            screen.getByRole('button', { name: /import repertoire/i })
        ).toBeInTheDocument();
    });

    it('Renders an "Export repertoire" button', () => {
        renderRouter();
        expect(
            screen.getByRole('button', { name: /export repertoire/i })
        ).toBeInTheDocument();
    });
});
