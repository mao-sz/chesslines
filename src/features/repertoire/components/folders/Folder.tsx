import { DragEvent, type FormEvent, MouseEvent, useState } from 'react';
import { FolderNameForm } from './FolderNameForm';
import { FolderName } from './FolderName';
import { IconButton } from '@/components/util/IconButton';
import { ICONS } from '@/util/constants';
import type { StateSetter, UUID } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './folders.module.css';
import { convert } from '@/util/util';

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

    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
    function makeDropTarget(e: DragEvent) {
        if (folder.contains !== 'lines') {
            e.preventDefault();
        }
    }

    function startDrag(e: DragEvent) {
        // must not be able to drag base w/b folders
        if (id === 'w' || id === 'b') {
            return;
        }

        // prevent dragging ancestor folders along with it
        e.stopPropagation();
        e.dataTransfer.clearData();
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
    }

    function appendDraggedFolder(e: DragEvent) {
        // restrict dropping to direct drop target only
        e.stopPropagation();
        e.preventDefault();

        const targetFolder = e.currentTarget as HTMLElement;
        const draggedId = e.dataTransfer.getData('text');
        if (draggedId === 'w' || draggedId === 'b' || draggedId === id) {
            return;
        }

        const isAlreadyInFolder = Boolean(
            targetFolder.querySelector(
                `[aria-label="folders within ${folder.name} folder"] > li > #${convert.uuidToId(draggedId)}`
            )
        );
        if (!isAlreadyInFolder && folder.contains !== 'lines') {
            folders.updateLocation(draggedId as UUID, id);
            setIsOpen(true);
        }
    }

    return (
        <div
            id={convert.uuidToId(id)}
            className={styles.folder}
            aria-label={`${folder.name} ${isOpen || id === currentLinesFolder ? 'open' : 'closed'} folder`}
            draggable={!isBaseFolder}
            onDragEnter={makeDropTarget}
            onDragOver={makeDropTarget}
            onDragStart={startDrag}
            onDrop={appendDraggedFolder}
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
                <ul
                    role="list"
                    className={styles.contents}
                    aria-label={`folders within ${folder.name} folder`}
                >
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
