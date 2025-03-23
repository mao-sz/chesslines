import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepertoirePage } from './RepertoirePage';
import { helpers } from '@/testing/helpers';

describe('Initial elements', () => {
    it('Renders a button for each of white and black repertoires', () => {
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('Renders by default with the white repertoire tab panel showing only', () => {
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

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
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

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

describe('New folder/line buttons', () => {
    it("Renders both 'new' buttons when active folder is empty", () => {
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        expect(
            screen.getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /new line/i })
        ).toBeInTheDocument();
    });

    it("Renders only 'new folder' button when active folder contains folders", () => {
        render(
            <RepertoirePage repertoire={helpers.repertoire.withFolderInWhite} />
        );

        expect(
            screen.getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: /new line/i })
        ).not.toBeInTheDocument();
    });

    it("Renders only 'new line' button when active folder contains lines", () => {
        render(
            <RepertoirePage repertoire={helpers.repertoire.withLineInWhite} />
        );

        expect(
            screen.queryByRole('button', { name: /new folder/i })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /new line/i })
        ).toBeInTheDocument();
    });
});
