import { useState } from 'react';
import { Tabs } from './Tabs';
import { Folder } from './Folder';
import type { StateSetter } from '@/types/utility';
import type { Colour } from '@/types/chessboard';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './folders.module.css';

type FolderPanelProps = {
    folders: RepertoireWithMethods['folders'];
    currentLinesFolder: RepertoireFolderID | null;
    setCurrentLinesFolder: StateSetter<RepertoireFolderID | null>;
};

export function FolderPanel({
    folders,
    currentLinesFolder,
    setCurrentLinesFolder,
}: FolderPanelProps) {
    const [currentTab, setCurrentTab] = useState<Colour>('w');

    return (
        <div className={styles.panel}>
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

            <div
                className={styles.folders}
                role="tabpanel"
                aria-labelledby={currentTab === 'w' ? 'white-tab' : 'black-tab'}
            >
                <Folder
                    // key prevents retaining isOpen state when switching tabs
                    key={currentTab}
                    id={currentTab}
                    folders={folders}
                    currentLinesFolder={currentLinesFolder}
                    setCurrentLinesFolder={setCurrentLinesFolder}
                />
            </div>
        </div>
    );
}
