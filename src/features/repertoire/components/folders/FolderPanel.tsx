import { type FormEvent, useState } from 'react';
import { Tabs } from './Tabs';
import { Folder } from './Folder';
import { FolderNameForm } from './FolderNameForm';
import { ContainsSelectedLinesBadge } from './ContainsSelectedLinesBadge';
import { IconButton } from '@/components/util/IconButton';
import { COLOURS, ICONS } from '@/util/constants';
import type { StateSetter } from '@/types/utility';
import type { Colour } from '@/types/chessboard';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './folders.module.css';

type FolderPanelProps = {
    repertoire: RepertoireWithMethods;
    currentLinesFolder: RepertoireFolderID | null;
    setCurrentLinesFolder: StateSetter<RepertoireFolderID | null>;
    currentTab: Colour;
    setCurrentTab: StateSetter<Colour>;
};

export function FolderPanel({
    repertoire,
    currentLinesFolder,
    setCurrentLinesFolder,
    currentTab,
    setCurrentTab,
}: FolderPanelProps) {
    const { folders } = repertoire;
    const folderIDs = folders[currentTab].children;
    const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false);

    function createFolder(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.elements[0] as HTMLInputElement;
        folders.create(input.value, currentTab);
        setIsCreatingNewFolder(false);
    }

    return (
        <div className={styles.panel}>
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

            <div
                className={styles.folders}
                role="tabpanel"
                aria-labelledby={
                    currentTab === 'w' ? styles.leftTab : styles.rightTab
                }
            >
                <p>
                    Folders containing lines selected for training are marked
                    with <ContainsSelectedLinesBadge />
                </p>

                <div className={styles.newTopLevelFolderButton}>
                    <IconButton
                        type="button"
                        icon={ICONS.NEW_FOLDER}
                        ariaLabel={`new top-level ${COLOURS[currentTab]} folder`}
                        onClick={() => setIsCreatingNewFolder(true)}
                    />
                </div>

                {isCreatingNewFolder && (
                    <div className="listItem">
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
                <ul
                    className={`${styles.contents} ${styles.base}`}
                    role="list"
                    aria-label="folders"
                >
                    {folderIDs.map((folderID) => (
                        <Folder
                            // key prevents sharing stale isOpen state when switching tabs
                            key={folderID}
                            id={folderID}
                            repertoire={repertoire}
                            currentLinesFolder={currentLinesFolder}
                            setCurrentLinesFolder={setCurrentLinesFolder}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}
