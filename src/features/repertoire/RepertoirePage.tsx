import { useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { FolderPanel } from './components/folders/FolderPanel';
import { LinePanel } from './components/lines/LinePanel';
import { LineEditor } from './components/lines/LineEditor';
import type { UUID } from '@/types/utility';
import type { Repertoire, RepertoireFolderID } from '@/types/repertoire';
import type { Colour } from '@/types/chessboard';
import styles from './page.module.css';

type RepertoirePageProps = { repertoire: Repertoire };

export function RepertoirePage({ repertoire }: RepertoirePageProps) {
    const { folders, lines } = useRepertoire(repertoire);
    const [currentTab, setCurrentTab] = useState<Colour>('w');
    const [currentLinesFolder, setCurrentLinesFolder] =
        useState<RepertoireFolderID | null>(null);
    const [currentOpenLine, setCurrentOpenLine] = useState<UUID | 'new' | null>(
        null
    );

    return (
        <main className={styles.main}>
            <FolderPanel
                repertoire={{ folders, lines }}
                currentLinesFolder={currentLinesFolder}
                setCurrentLinesFolder={setCurrentLinesFolder}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            <LinePanel
                currentLinesFolderId={currentLinesFolder}
                folders={folders}
                lines={lines}
                setCurrentOpenLine={setCurrentOpenLine}
            />
            {currentOpenLine && currentLinesFolder && (
                <LineEditor
                    id={currentOpenLine}
                    lines={lines}
                    parentFolder={currentLinesFolder}
                    closeEditor={() => setCurrentOpenLine(null)}
                    currentTab={currentTab}
                />
            )}
        </main>
    );
}
