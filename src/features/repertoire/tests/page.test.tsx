import { useOutletContext } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepertoirePage } from '../RepertoirePage';
import { helpers } from '@/testing/helpers';

afterEach(vi.resetAllMocks);
vi.mock('react-router', async (importOriginal) => ({
    ...(await importOriginal()),
    // most tests won't use the line query param
    useSearchParams: vi.fn(() => [{ get: () => null }]),
    useOutletContext: vi.fn(),
}));

describe('Initial elements', () => {
    it('Renders a button for each of white and black repertoires', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        render(<RepertoirePage />);

        expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('Renders by default with the white repertoire tab panel showing only', () => {
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.empty,
        });
        render(<RepertoirePage />);

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
        vi.mocked(useOutletContext).mockReturnValue({
            repertoire: helpers.repertoire.withLineInWhite,
        });
        render(<RepertoirePage />);

        expect(
            screen.getByRole('region', { name: /empty line panel/i })
        ).toBeInTheDocument();
    });
});
