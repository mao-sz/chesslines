import { Line } from './Line';
import type { StateSetter, UUID } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import styles from './lines.module.css';
import { IconButton } from '@/components/IconButton';
import { ICONS } from '@/util/constants';

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

    const newLineButton = (
        <IconButton
            type="button"
            icon={ICONS.PLUS}
            ariaLabel="new line"
            onClick={() => setCurrentOpenLine('new')}
        />
    );

    return currentFolder?.contains === 'lines' ? (
        <section className={styles.panel} aria-labelledby="lines-folder-name">
            <div className={styles.heading}>
                <h2 id="lines-folder-name">{currentFolder.name}</h2>
                {newLineButton}
            </div>

            <ul className={styles.lines} aria-label="lines">
                {currentFolder.children.map((id) => (
                    <Line
                        key={id}
                        id={id}
                        lines={lines}
                        openLine={() => setCurrentOpenLine(id)}
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
                <div className={styles.heading}>
                    <h2 id="lines-folder-name">{currentFolder.name}</h2>
                    {currentFolder?.contains === 'either' && newLineButton}
                </div>
            )}

            <p>No lines to show</p>
        </section>
    );
}
