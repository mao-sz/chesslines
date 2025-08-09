import { DragEvent, type FormEvent, MouseEvent, useState } from 'react';
import { FolderNameForm } from './FolderNameForm';
import { FolderName } from './FolderName';
import { ConfirmableButton } from '@/components/util/ConfirmableButton';
import { IconButton } from '@/components/util/IconButton';
import { useDeepContainsSelectedLine } from '@/hooks/useDeepContainsSelectedLine';
import { ICONS } from '@/util/constants';
import { convert } from '@/util/util';
import type { StateSetter, UUID } from '@/types/utility';
import type {
    RepertoireFolder,
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './folders.module.css';

type FolderProps = {
    id: RepertoireFolderID;
    repertoire: RepertoireWithMethods;
    currentLinesFolder: RepertoireFolderID | null;
    setCurrentLinesFolder: StateSetter<RepertoireFolderID | null>;
};

export function Folder({
    id,
    repertoire,
    currentLinesFolder,
    setCurrentLinesFolder,
}: FolderProps) {
    const { folders, lines } = repertoire;
    const folder = folders[id];
    const isBaseFolder = id === 'w' || id === 'b';

    const deepContainsSelectedLine = useDeepContainsSelectedLine(folders, id);

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
        e.preventDefault();
    }

    function startDrag(e: DragEvent) {
        // must not be able to drag base w/b folders
        if (id === 'w' || id === 'b') {
            return;
        }

        // prevent dragging ancestor folders along with it
        e.stopPropagation();
        e.dataTransfer.clearData();
        e.dataTransfer.setData('text/plain', `folder ${id}`);
        e.dataTransfer.effectAllowed = 'move';
    }

    function appendDraggedItem(e: DragEvent) {
        // restrict dropping to direct drop target only
        e.stopPropagation();
        e.preventDefault();

        const [type, draggedId] = e.dataTransfer.getData('text').split(' ');
        if (draggedId === 'w' || draggedId === 'b' || draggedId === id) {
            return;
        }

        const draggedUUID = draggedId as UUID;
        const isAlreadyInFolder =
            folder.contains === (`${type}s` as 'folders' | 'lines') &&
            folder.children.includes(draggedUUID);
        if (isAlreadyInFolder) {
            return;
        }

        if (type === 'folder' && folder.contains !== 'lines') {
            folders.updateLocation(draggedUUID, id);
            setIsOpen(true);
        } else if (type === 'line' && folder.contains !== 'folders') {
            lines.updateLocation(draggedUUID, id);
        }
    }

    function highlightWhenDraggedOver(action: 'add' | 'remove') {
        return (e: DragEvent) => {
            e.currentTarget.classList[action](styles.highlighted);
        };
    }

    return (
        <li
            id={convert.uuidToHtmlId(id)}
            className={styles.folder}
            aria-label={`${folder.name} ${isOpen || id === currentLinesFolder ? 'open' : 'closed'} folder`}
            data-type="folder"
            draggable={!isBaseFolder}
            onDragEnter={makeDropTarget}
            onDragOver={makeDropTarget}
            onDragStart={startDrag}
            onDrop={appendDraggedItem}
        >
            <div
                className={`${styles.controls} ${deepContainsSelectedLine ? styles.highlighted : ''}`.trim()}
                onDragEnter={highlightWhenDraggedOver('add')}
                onDragExit={highlightWhenDraggedOver('remove')}
                onDrop={highlightWhenDraggedOver('remove')}
            >
                {!isBaseFolder && (
                    <div
                        className={styles.dragHandle}
                        aria-label="drag handle"
                        title="Drag to move folder"
                    >
                        <i className={ICONS.DRAG}></i>
                    </div>
                )}
                <div
                    className={`${styles.heading} ${isBaseFolder ? '' : styles.notBase}`}
                    title={getTooltipText(folder.contains, isOpen)}
                >
                    {/* absolutely-positioned clickable background to open/close folder */}
                    <button
                        className={styles.openToggle}
                        aria-label={`${isOpen ? 'close' : 'open'} ${folder.name} folder ${folder.contains !== 'folders' ? 'in lines panel' : ''}`}
                        onClick={handleClickOnFolder}
                    ></button>

                    {folder.contains === 'folders' && !isRenaming && (
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
                        <ConfirmableButton handleConfirm={deleteFolder}>
                            <IconButton
                                type="button"
                                icon={ICONS.BIN}
                                ariaLabel="delete folder"
                            />
                        </ConfirmableButton>
                    )}
                </div>
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
                        <Folder
                            key={childId}
                            id={childId}
                            repertoire={repertoire}
                            currentLinesFolder={currentLinesFolder}
                            setCurrentLinesFolder={setCurrentLinesFolder}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

function getTooltipText(
    folderType: RepertoireFolder['contains'],
    isOpen: boolean
): string {
    if (folderType === 'folders') {
        return `${isOpen ? 'Collapse' : 'Expand'} folder`;
    }
    return 'Open folder in lines panel';
}
