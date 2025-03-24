import type { FormEvent } from 'react';

type NewFolderFormProps = {
    createFolder: (e: FormEvent) => void;
    discardForm: () => void;
};

export function NewFolderForm({
    createFolder,
    discardForm,
}: NewFolderFormProps) {
    return (
        <form aria-label="new folder" onSubmit={createFolder}>
            <label>
                Name (required): <input type="text" name="name" />
            </label>
            <button type="submit">Create folder</button>
            <button type="button" onClick={discardForm}>
                Cancel
            </button>
        </form>
    );
}
