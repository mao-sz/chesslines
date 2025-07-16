import { type FormEvent, MouseEvent, useState } from 'react';
import { FolderNameForm } from './FolderNameForm';
import { ICONS } from '@/util/constants';
import type { StateSetter } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './folders.module.css';
import { FolderName } from './FolderName';
import { IconButton } from '@/components/util/IconButton';

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

    function handleClickOnFolder(e: MouseEvent) {
        const eventTarget = e.target as HTMLElement;
        const canBeToggledOpen =
            folder.contains === 'folders' &&
            !isCreatingNewFolder &&
            !isRenaming;
        const clickingOpenableFolderItself =
            canBeToggledOpen && !eventTarget.closest('.iconButton');

        if (clickingOpenableFolderItself) {
            setIsOpen(!isOpen);
        } else if (folder.contains !== 'folders') {
            // opens lines folder in lines panel
            setCurrentLinesFolder(id);
        }
    }

    function showNewFolderForm() {
        setIsCreatingNewFolder(true);
        // setIsOpen(isOpen);
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
                {folder.contains === 'folders' && (
                    <i className={isOpen ? ICONS.OPENED : ICONS.CLOSED}></i>
                )}

                <FolderName
                    name={folder.name}
                    isRenaming={isRenaming}
                    setIsRenaming={setIsRenaming}
                    updateFolderName={updateFolderName}
                />

                {showingNewFolderButton && (
                    <IconButton
                        type="button"
                        icon={ICONS.NEW_FOLDER}
                        ariaLabel="new folder"
                        onClick={showNewFolderForm}
                    />
                )}

                {showingDeleteButton && (
                    <IconButton
                        type="button"
                        icon={ICONS.BIN}
                        ariaLabel="delete folder"
                        onClick={deleteFolder}
                    />
                )}
            </div>

            {isCreatingNewFolder && (
                <div className={`${styles.heading} ${styles.newFolder}`}>
                    <FolderNameForm
                        ariaLabel="new folder"
                        handleSubmit={createFolder}
                        submit={{ icon: ICONS.TICK, text: 'Create folder' }}
                        cancel={{ icon: ICONS.CROSS, text: 'Cancel' }}
                        discardForm={() => setIsCreatingNewFolder(false)}
                    />
                </div>
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
