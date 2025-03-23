export function NewFolderForm({ createFolder }) {
    return (
        <form aria-label="new folder" onSubmit={createFolder}>
            <label>
                Name (required): <input type="text" name="name" />
            </label>
            <button>Create folder</button>
        </form>
    );
}
