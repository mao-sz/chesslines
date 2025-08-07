import { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router';
import { useRepertoire } from '@/hooks/useRepertoire';
import { findParentFolder } from '@/util/util';
import { FolderPanel } from './components/folders/FolderPanel';
import { LinePanel } from './components/lines/LinePanel';
import { LineEditor } from './components/lines/LineEditor';
import type { OutletContext, UUID } from '@/types/utility';
import type { RepertoireFolderID } from '@/types/repertoire';
import type { Colour } from '@/types/chessboard';
import styles from './page.module.css';

export function RepertoirePage() {
    document.title = 'Chesslines | Repertoire';

    const { repertoire } = useOutletContext<OutletContext>();
    const [searchParams] = useSearchParams();

    const searchParamLineID = (searchParams.get('line') as UUID) || null;
    const searchParamLineParentFolder = findParentFolder(
        searchParamLineID,
        repertoire
    );

    const { folders, lines } = useRepertoire(repertoire);
    const [currentTab, setCurrentTab] = useState<Colour>(
        lines[searchParamLineID]?.player || 'w'
    );
    const [currentLinesFolder, setCurrentLinesFolder] =
        useState<RepertoireFolderID | null>(searchParamLineParentFolder);
    const [currentOpenLine, setCurrentOpenLine] = useState<UUID | 'new' | null>(
        searchParamLineID
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
            {/* LinePanel key ensures fresh selected folder lines state when changing folders */}
            <LinePanel
                key={currentLinesFolder}
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
