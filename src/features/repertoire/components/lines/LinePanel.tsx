import { Line } from './Line';
import type { StateSetter, UUID } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';

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
        <button aria-label="new line" onClick={() => setCurrentOpenLine('new')}>
            +
        </button>
    );

    return currentFolder?.contains === 'lines' ? (
        <section aria-labelledby="lines-folder-name">
            <h2 id="lines-folder-name">{currentFolder.name}</h2>
            <ul aria-label="lines">
                {currentFolder.children.map((id) => (
                    <Line
                        key={id}
                        id={id}
                        lines={lines}
                        openLine={() => setCurrentOpenLine(id)}
                    />
                ))}
            </ul>
            {newLineButton}
        </section>
    ) : (
        <section aria-label="empty line panel">
            {currentFolder && (
                <h2 id="lines-folder-name">{currentFolder.name}</h2>
            )}

            <p>No lines to show</p>

            {currentFolder?.contains === 'either' && newLineButton}
        </section>
    );
}
