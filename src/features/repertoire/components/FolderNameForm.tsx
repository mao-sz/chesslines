import type { FormEvent } from 'react';

type FolderNameFormProps = {
    ariaLabel: string;
    handleSubmit: (e: FormEvent) => void;
    submitText: [string, string];
    cancelText: [string, string];
    discardForm: () => void;
};

export function FolderNameForm({
    ariaLabel,
    handleSubmit,
    submitText: [submitButtonText, submitButtonAriaLabel],
    cancelText: [cancelButtonText, cancelButtonAriaLabel],
    discardForm,
}: FolderNameFormProps) {
    return (
        <form aria-label={ariaLabel} onSubmit={handleSubmit}>
            <label>
                Name (required): <input type="text" name="name" />
            </label>
            <button
                type="submit"
                aria-label={submitButtonAriaLabel || submitButtonText}
            >
                {submitButtonText}
            </button>
            <button
                type="button"
                aria-label={cancelButtonAriaLabel || cancelButtonText}
                onClick={discardForm}
            >
                {cancelButtonText}
            </button>
        </form>
    );
}
