import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

    it("Prevents closing a tab's base folder", async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage repertoire={helpers.repertoire.withFolderInWhite} />
        );
        const baseFolder = screen.getByRole('generic', {
            name: /white open folder/i,
        });
        await user.click(baseFolder);

        expect(baseFolder).toHaveAccessibleName(/white open folder/i);
        expect(
            within(baseFolder).getByRole('generic', { name: /closed folder$/i })
        ).toBeInTheDocument();
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
    it("Renders both 'new' buttons when folder is empty", () => {
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        expect(
            screen.getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /new line/i })
        ).toBeInTheDocument();
    });

    it("Renders only 'new folder' button when folder contains folders", () => {
        render(
            <RepertoirePage repertoire={helpers.repertoire.withFolderInWhite} />
        );

        const whiteFolder = screen.getByRole('generic', {
            name: /white open folder/i,
        }).firstElementChild as HTMLElement;

        expect(
            within(whiteFolder).getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            within(whiteFolder).queryByRole('button', { name: /new line/i })
        ).not.toBeInTheDocument();
    });

    it("Renders only 'new line' button when folder contains lines", () => {
        render(
            <RepertoirePage repertoire={helpers.repertoire.withLineInWhite} />
        );

        const whiteFolder = screen.getByRole('generic', {
            name: /white open folder/i,
        }).firstElementChild as HTMLElement;

        expect(
            within(whiteFolder).queryByRole('button', { name: /new folder/i })
        ).not.toBeInTheDocument();
        expect(
            within(whiteFolder).getByRole('button', { name: /new line/i })
        ).toBeInTheDocument();
    });

    it("Does not render any form for 'new folder' or 'new line' if respective button not clicked", () => {
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        expect(
            screen.queryByRole('form', { name: /^new/i })
        ).not.toBeInTheDocument();
    });

    it("Replaces 'new *' button(s) with new folder name form when new folder button clicked", async () => {
        const user = userEvent.setup();
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        expect(newFolderButton).not.toBeInTheDocument();
        expect(
            screen.getByRole('form', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('textbox', { name: /name/i })
        ).toBeInTheDocument();
    });

    it('Prevents a folder from being closed if new folder name form present', async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage repertoire={helpers.repertoire.withNestedFolders} />
        );

        const closableFolder = screen.getByRole('generic', {
            name: /child closed folder$/i,
        });
        // open the first child folder
        await user.click(closableFolder.firstElementChild as HTMLElement);

        const newFolderButton = within(closableFolder).getAllByRole('button', {
            name: /new folder/i,
        })[0];
        await user.click(newFolderButton);
        await user.click(closableFolder);

        expect(closableFolder).toHaveAccessibleName(/child open folder$/i);
    });

    it('Adds new folder when new folder name submitted', async () => {
        const user = userEvent.setup();
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const newFolderNameInput = screen.getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'new folder name');
        await user.keyboard('[Enter]');

        expect(
            screen.getByRole('heading', { name: /new folder name/i })
        ).toBeInTheDocument();
    });

    it('Replaces new folder name form with new folder button after submission', async () => {
        const user = userEvent.setup();
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        const whiteFolder = screen.getByRole('generic', {
            name: /white open folder/i,
        }).firstElementChild as HTMLElement;

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const newFolderNameInput = screen.getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'new folder name');
        await user.keyboard('[Enter]');

        // not the same ref as newFolderButton
        expect(
            within(whiteFolder).getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(newFolderNameInput).not.toBeInTheDocument();
    });

    it('Discards new folder name form without submitting and renders new folder button when cancel button clicked', async () => {
        const user = userEvent.setup();
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        const displayedFolderCount = screen.queryAllByRole('generic', {
            name: /folder$/i,
        }).length;

        const newFolderButton = screen.getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        // not the same ref as newFolderButton
        expect(
            screen.getByRole('button', { name: /new folder/i })
        ).toBeInTheDocument();
        expect(
            screen.queryAllByRole('generic', { name: /folder$/i })
        ).toHaveLength(displayedFolderCount);
    });

    it('Auto-opens closed folder when new folder is added', async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage repertoire={helpers.repertoire.withFolderInWhite} />
        );

        const closedFolder = screen.getByRole('generic', {
            name: /closed folder$/i,
        });
        const newFolderButton = within(closedFolder).getByRole('button', {
            name: /new folder/i,
        });
        await user.click(newFolderButton);
        const newFolderNameInput = within(closedFolder).getByRole('textbox', {
            name: /name/i,
        });
        await user.type(newFolderNameInput, 'another new folder name');
        await user.keyboard('[Enter]');

        expect(closedFolder).toHaveAccessibleName(/open folder$/i);
    });

    it('Adds new empty line (with standard starting FEN) when new line button clicked', async () => {
        const user = userEvent.setup();
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        const lineCount = screen.queryAllByLabelText(/starting fen/i).length;

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        expect(screen.queryAllByLabelText(/starting fen/i)).toHaveLength(
            lineCount + 1
        );
    });

    it('Auto-opens closed folder when new line is added', async () => {
        const user = userEvent.setup();
        render(
            <RepertoirePage repertoire={helpers.repertoire.withFolderInWhite} />
        );

        const closedFolder = screen.getByRole('generic', {
            name: /closed folder$/i,
        });

        const newLineButton = within(closedFolder).getByRole('button', {
            name: /new line/i,
        });
        await user.click(newLineButton);

        expect(closedFolder).toHaveAccessibleName(/open folder$/i);
    });

    it('Keeps new line button rendered after clicking it', async () => {
        const user = userEvent.setup();
        render(<RepertoirePage repertoire={helpers.repertoire.empty} />);

        const newLineButton = screen.getByRole('button', { name: /new line/i });
        await user.click(newLineButton);

        expect(newLineButton).toBeInTheDocument();
    });
});
