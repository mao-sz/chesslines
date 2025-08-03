import { describe, it, expect, afterEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { RepertoireErrorPage } from '../RepertoireErrorPage';

afterEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
});
// Must stub as cannot create spy for window.location.reload due to read-only nature of window.location
vi.stubGlobal('location', { reload: vi.fn() });
// Cannot spy on window.localStorage or its properties directly
// https://github.com/jsdom/jsdom/issues/2318
const localStorageSetSpy = vi.spyOn(Storage.prototype, 'setItem');
const localStorageRemoveSpy = vi.spyOn(Storage.prototype, 'removeItem');

const repertoireStrings = {
    valid: '{"folders":{"w":{"name":"White","contains":"folders","children":["c1d45e7e-46bb-4525-8ae1-7aede938b246"]},"b":{"name":"Black","contains":"either","children":[]},"c1d45e7e-46bb-4525-8ae1-7aede938b246":{"name":"foo","contains":"either","children":[]}},"lines":{}}',
    invalid:
        '{"folders":{"w":{"name":"White","contains":"folders","children":["c1d45e7e-46bb-4525-8ae1-7aede938b246"]},"b":{"name":"Black","contains":"either","children":[]},"c1d45e7e-46bb-4525-8ae1-7aede938b246":{"name":"foo","contains":"either","children":[]}},"lines":{}}',
};

describe('Repertoire error page', () => {
    it('Displays error reason and invalid data', () => {
        render(
            <RepertoireErrorPage
                errorReason="foo"
                invalidRepertoireString="bar"
            />
        );

        expect(screen.getByText('foo')).toBeInTheDocument();
        expect(
            screen.getByRole('textbox', { name: /invalid repertoire data/i })
        ).toHaveValue('bar');
    });

    it('Sets updated repertoire data in local storage and reloads page when form submitted', async () => {
        const user = userEvent.setup();
        render(
            <RepertoireErrorPage
                errorReason="foo"
                invalidRepertoireString={repertoireStrings.invalid}
            />
        );

        const textArea = screen.getByRole('textbox', {
            name: /invalid repertoire data/i,
        });
        const saveButton = screen.getByRole('button', { name: /save/i });

        await user.clear(textArea);
        await user.type(
            textArea,
            // double `{[` to type literally instead of being read as special chars
            // https://testing-library.com/docs/user-event/keyboard
            repertoireStrings.valid.replaceAll(/[{[]/g, (match) =>
                match.repeat(2)
            )
        );
        await user.click(saveButton);

        expect(localStorageSetSpy).toHaveBeenCalledWith(
            'repertoire',
            repertoireStrings.valid
        );
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('Discards stored repertoire if discard button clicked', async () => {
        const user = userEvent.setup();
        render(
            <RepertoireErrorPage
                errorReason="foo"
                invalidRepertoireString={repertoireStrings.invalid}
            />
        );

        const discardButton = screen.getByRole('button', {
            name: /discard repertoire/i,
        });
        await user.click(discardButton);

        expect(localStorageRemoveSpy).toHaveBeenCalledWith('repertoire');
        expect(window.location.reload).toHaveBeenCalled();
    });
});
