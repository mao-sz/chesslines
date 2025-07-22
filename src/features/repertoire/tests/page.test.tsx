import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { routes } from '@/app/routes';

const testRouter = createMemoryRouter(routes);

describe('Initial elements', () => {
    it('Renders a button for each of white and black repertoires', () => {
        render(<RouterProvider router={testRouter} />);

        expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('Renders by default with the white repertoire tab panel showing only', () => {
        render(<RouterProvider router={testRouter} />);

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
        render(<RouterProvider router={testRouter} />);

        expect(
            screen.getByRole('region', { name: /empty line panel/i })
        ).toBeInTheDocument();
    });
});
