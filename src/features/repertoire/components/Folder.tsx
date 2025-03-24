import { type FormEvent, MouseEvent, useState } from 'react';
import { Line } from './Line';
import { FolderNameForm } from './FolderNameForm';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './repertoire.module.css';

type FolderProps = {
    id: RepertoireFolderID;
    lines: RepertoireWithMethods['lines'];
    folders: RepertoireWithMethods['folders'];
};

const STANDARD_STARTING_FEN =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function Folder({ id, lines, folders }: FolderProps) {
    const folder = folders[id];
    const isBaseFolder = id === 'w' || id === 'b';

    const [isOpen, setIsOpen] = useState(isBaseFolder);
    const [isRenaming, setIsRenaming] = useState(false);
    const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false);

    function toggleFolderOpen(e: MouseEvent) {
        if (
            isBaseFolder ||
            isCreatingNewFolder ||
            isRenaming ||
            (e.target as HTMLElement).tagName === 'BUTTON'
        ) {
            return;
        }
        setIsOpen(!isOpen);
    }

    function createFolder(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.elements[0] as HTMLInputElement;
        folders.create(input.value, id);
        setIsCreatingNewFolder(false);
        setIsOpen(true);
    }

    function createLine() {
        lines.create(STANDARD_STARTING_FEN, '', id);
        setIsOpen(true);
    }

    function updateFolderName(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.elements[0] as HTMLInputElement;
        folders.updateName(id, input.value);
        setIsRenaming(false);
    }

    return (
        <div
            className={styles.folder}
            aria-label={`${folder.name} ${isOpen ? 'open' : 'closed'} folder`}
        >
            <div className={styles.heading} onClick={toggleFolderOpen}>
                {isRenaming ? (
                    <FolderNameForm
                        ariaLabel="rename folder"
                        handleSubmit={updateFolderName}
                        submitText={['✓', 'Set new folder name']}
                        cancelText={['×', 'Cancel folder rename']}
                        discardForm={() => setIsRenaming(false)}
                    />
                ) : (
                    <>
                        <h2>{folder.name}</h2>
                        {!isBaseFolder && (
                            <button
                                aria-label="rename folder"
                                onClick={() => setIsRenaming(true)}
                            >
                                🖉
                            </button>
                        )}
                    </>
                )}

                {!isCreatingNewFolder && !isRenaming && (
                    <div>
                        {folders[id].contains !== 'folders' && (
                            <button onClick={createLine}>New line</button>
                        )}
                        {folders[id].contains !== 'lines' && (
                            <button
                                onClick={() => setIsCreatingNewFolder(true)}
                            >
                                New folder
                            </button>
                        )}
                    </div>
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
            <ul role="list" className={styles.contents}>
                {isOpen &&
                    folder.children.map((childId) => (
                        <li key={childId}>
                            {folder.contains === 'folders' ? (
                                <Folder
                                    id={childId}
                                    lines={lines}
                                    folders={folders}
                                />
                            ) : (
                                <Line
                                    id={childId}
                                    lines={lines}
                                    startingFEN={lines[childId].startingFEN}
                                    PGN={lines[childId].PGN}
                                />
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
