import type { FormEvent } from 'react';

type NewFolderFormProps = { createFolder: (e: FormEvent) => void };

export function NewFolderForm({ createFolder }: NewFolderFormProps) {
    return (
        <form aria-label="new folder" onSubmit={createFolder}>
            <label>
                Name (required): <input type="text" name="name" />
            </label>
            <button>Create folder</button>
        </form>
    );
}
