import { type FormEvent, MouseEvent, useState } from 'react';
import { FolderNameForm } from './FolderNameForm';
import { CHARS } from '@/util/constants';
import type { StateSetter } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './folders.module.css';
import { FolderName } from './FolderName';

type FolderProps = {
    id: RepertoireFolderID;
    folders: RepertoireWithMethods['folders'];
    currentLinesFolder: RepertoireFolderID | null;
    setCurrentLinesFolder: StateSetter<RepertoireFolderID | null>;
};

export function Folder({
    id,
    folders,
    currentLinesFolder,
    setCurrentLinesFolder,
}: FolderProps) {
    const folder = folders[id];
    const isBaseFolder = id === 'w' || id === 'b';

    const [isOpen, setIsOpen] = useState(
        isBaseFolder && folder.contains === 'folders'
    );
    const [isRenaming, setIsRenaming] = useState(false);
    const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false);

    const showingNewFolderButton =
        folder.contains !== 'lines' && !isCreatingNewFolder && !isRenaming;
    const showingDeleteButton =
        !isRenaming && !isBaseFolder && !folder.children.length;
    const canBeToggledOpen =
        folder.contains === 'folders' && !isCreatingNewFolder && !isRenaming;

    function handleClickOnFolder(e: MouseEvent) {
        if (
            canBeToggledOpen &&
            (e.target as HTMLElement).tagName !== 'BUTTON'
        ) {
            setIsOpen(!isOpen);
        } else if (folder.contains !== 'folders') {
            // opens lines folder in lines panel
            setCurrentLinesFolder(id);
        }
    }

    function createFolder(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.elements[0] as HTMLInputElement;
        folders.create(input.value, id);
        setIsCreatingNewFolder(false);
        setIsOpen(true);
    }

    function updateFolderName(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.elements[0] as HTMLInputElement;
        folders.updateName(id, input.value);
        setIsRenaming(false);
    }

    function deleteFolder() {
        folders.delete(id);
    }

    return (
        <div
            className={styles.folder}
            aria-label={`${folder.name} ${isOpen || id === currentLinesFolder ? 'open' : 'closed'} folder`}
        >
            <div
                className={`${styles.heading} ${isBaseFolder ? styles.base : ''}`}
                onClick={handleClickOnFolder}
            >
                <FolderName
                    name={folder.name}
                    isCollapseArrowShowing={canBeToggledOpen}
                    isFolderOpen={isOpen}
                    isRenaming={isRenaming}
                    setIsRenaming={setIsRenaming}
                    updateFolderName={updateFolderName}
                />

                {showingNewFolderButton && (
                    <button onClick={() => setIsCreatingNewFolder(true)}>
                        New folder
                    </button>
                )}

                {showingDeleteButton && (
                    <button aria-label="delete folder" onClick={deleteFolder}>
                        {CHARS.CROSS}
                    </button>
                )}
            </div>

            {isCreatingNewFolder && (
                <FolderNameForm
                    ariaLabel="new folder"
                    handleSubmit={createFolder}
                    submitText={['Create folder', '']}
                    cancelText={['Cancel', '']}
                    discardForm={() => setIsCreatingNewFolder(false)}
                />
            )}

            {/* https://developer.mozilla.org/en-US/docs/Web/CSS/list-style#accessibility
                list-style: none removes list accessibility role in Safari */}
            {isOpen && (
                <ul role="list" className={styles.contents}>
                    {folder.children.map((childId) => (
                        <li key={childId}>
                            <Folder
                                id={childId}
                                folders={folders}
                                currentLinesFolder={currentLinesFolder}
                                setCurrentLinesFolder={setCurrentLinesFolder}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
