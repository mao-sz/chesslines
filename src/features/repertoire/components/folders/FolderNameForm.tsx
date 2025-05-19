import { TextInput } from '@/components/TextInput';
import type { FormEvent } from 'react';

type FolderNameFormProps = {
    ariaLabel: string;
    defaultValue?: string;
    handleSubmit: (e: FormEvent) => void;
    submitText: [string, string];
    cancelText: [string, string];
    discardForm: () => void;
};

export function FolderNameForm({
    ariaLabel,
    defaultValue = '',
    handleSubmit,
    submitText: [submitButtonText, submitButtonAriaLabel],
    cancelText: [cancelButtonText, cancelButtonAriaLabel],
    discardForm,
}: FolderNameFormProps) {
    return (
        <form aria-label={ariaLabel} onSubmit={handleSubmit}>
            <TextInput
                name="name"
                defaultValue={defaultValue}
                isRequired={true}
                labelText="Name"
            />
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
