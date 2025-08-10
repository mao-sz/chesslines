import { Tabs } from './Tabs';
import { Folder } from './Folder';
import { ContainsSelectedLinesBadge } from './ContainsSelectedLinesBadge';
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

                {/* https://developer.mozilla.org/en-US/docs/Web/CSS/list-style#accessibility
                list-style: none removes list accessibility role in Safari */}
                <ul
                    className={styles.contents}
                    role="list"
                    aria-label="folders"
                >
                    <Folder
                        // key prevents sharing stale isOpen state when switching tabs
                        key={currentTab}
                        id={currentTab}
                        repertoire={repertoire}
                        currentLinesFolder={currentLinesFolder}
                        setCurrentLinesFolder={setCurrentLinesFolder}
                    />
                </ul>
            </div>
        </div>
    );
}
