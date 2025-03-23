import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepertoirePage } from './RepertoirePage';

describe('Initial elements', () => {
    it('Renders a button for each of white and black repertoires', () => {
        render(<RepertoirePage />);

        expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('Renders by default with the white repertoire tab panel showing only', () => {
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
});

describe('Switching repertoire tabs', () => {
    it('Switches from white to black repertoire panels via tab buttons', async () => {
        const user = userEvent.setup();
        render(<RepertoirePage />);

        const whiteTabButton = screen.getByRole('tab', {
            name: /white repertoire/i,
        });
        const blackTabButton = screen.getByRole('tab', {
            name: /black repertoire/i,
        });

        await user.click(blackTabButton);

        expect(whiteTabButton.ariaSelected).toBe('false');
        expect(blackTabButton.ariaSelected).toBe('true');

        expect(
            screen.queryByRole('tabpanel', { name: /white repertoire/i })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole('tabpanel', { name: /black repertoire/i })
        ).toBeInTheDocument();
    });
});
