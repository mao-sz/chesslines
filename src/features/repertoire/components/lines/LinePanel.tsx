import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Line } from './Line';
import { IconButton } from '@/components/util/IconButton';
import { ICONS } from '@/util/constants';
import { stripDuplicates } from '@/util/util';
import type { OutletContext, StateSetter, UUID } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './lines.module.css';

type LinePanelProps = {
    currentLinesFolderId: RepertoireFolderID | null;
    folders: RepertoireWithMethods['folders'];
    lines: RepertoireWithMethods['lines'];
    setCurrentOpenLine: StateSetter<UUID | 'new' | null>;
};

export function LinePanel({
    currentLinesFolderId,
    folders,
    lines,
    setCurrentOpenLine,
}: LinePanelProps) {
    const currentFolder = currentLinesFolderId
        ? folders[currentLinesFolderId]
        : null;
    const folderLines: UUID[] =
        currentFolder?.contains === 'lines' ? currentFolder.children : [];

    const { lineIDsToTrain, setLineIDsToTrain } =
        useOutletContext<OutletContext>();
    const [selectedFolderLines, setSelectedFolderLines] = useState(
        folderLines.filter((id) => lineIDsToTrain.includes(id))
    );

    function addAllFolderLineIDsToTrainer() {
        const updatedIDsToTrain = stripDuplicates([
            ...lineIDsToTrain,
            ...folderLines,
        ]);
        setLineIDsToTrain(updatedIDsToTrain);
        setSelectedFolderLines([...folderLines]);
    }

    function removeAllFolderLineIDsFromTrainer() {
        setLineIDsToTrain(
            lineIDsToTrain.filter(
                (selectedID) => !folderLines.includes(selectedID)
            )
        );
        setSelectedFolderLines([]);
    }

    return currentFolder?.contains === 'lines' ? (
        <section className={styles.panel} aria-labelledby="lines-folder-name">
            <div className={styles.top}>
                <h2 id="lines-folder-name">{currentFolder.name}</h2>
                <IconButton
                    type="button"
                    icon={ICONS.PLUS}
                    ariaLabel="new line"
                    onClick={() => setCurrentOpenLine('new')}
                />
            </div>

            <div className={styles.select}>
                {selectedFolderLines.length > 0 ? (
                    <button onClick={removeAllFolderLineIDsFromTrainer}>
                        De-select all
                    </button>
                ) : (
                    <button onClick={addAllFolderLineIDsToTrainer}>
                        Select all
                    </button>
                )}
                <p>Selected lines will be loaded in the trainer</p>
            </div>

            <ul className={styles.lines} aria-label="lines">
                {currentFolder.children.map((id) => (
                    <Line
                        key={id}
                        id={id}
                        lines={lines}
                        openLine={() => setCurrentOpenLine(id)}
                        setSelectedFolderLines={setSelectedFolderLines}
                    />
                ))}
            </ul>
        </section>
    ) : (
        <section
            className={`${styles.panel} ${styles.empty}`}
            aria-label="empty line panel"
        >
            {currentFolder && (
                <div className={styles.top}>
                    <h2 id="lines-folder-name">{currentFolder.name}</h2>
                    {currentFolder?.contains === 'either' && (
                        <IconButton
                            type="button"
                            icon={ICONS.PLUS}
                            ariaLabel="new line"
                            onClick={() => setCurrentOpenLine('new')}
                        />
                    )}
                </div>
            )}

            <p>No lines to show</p>
        </section>
    );
}
