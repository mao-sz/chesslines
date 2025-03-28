import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest'; // for matcher types

expect.extend(matchers);

// For some reason jsdom still has not implemented HTMLDialogElement, so dialog methods/events need mocking
// https://github.com/jsdom/jsdom/pull/3403
HTMLDialogElement.prototype.showModal ??= vi.fn(function (
    this: HTMLDialogElement
) {
    this.open = true;
});
HTMLDialogElement.prototype.close ??= vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event('close'));
});

afterEach(cleanup);
