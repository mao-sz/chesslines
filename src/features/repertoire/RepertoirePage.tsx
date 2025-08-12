import { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router';
import { useRepertoire } from '@/hooks/useRepertoire';
import { findParentFolder } from '@/util/util';
import { FolderPanel } from './components/folders/FolderPanel';
import { LinePanel } from './components/lines/LinePanel';
import { LineEditor } from './components/lines/LineEditor';
import { ImportModal } from './components/import/ImportModal';
import { ExportButton } from '@/components/util/ExportButton';
import type { OutletContext, UUID } from '@/types/utility';
import type { RepertoireFolderID } from '@/types/repertoire';
import type { Colour } from '@/types/chessboard';
import styles from './page.module.css';

export function RepertoirePage() {
    document.title = 'Chesslines | Repertoire';

    const { repertoire } = useOutletContext<OutletContext>();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentOpenLine = (searchParams.get('line') as UUID) || null;
    const searchParamLineParentFolder = findParentFolder(
        currentOpenLine,
        repertoire
    );

    const { folders, lines } = useRepertoire(repertoire);
    const [currentTab, setCurrentTab] = useState<Colour>(
        lines[currentOpenLine]?.player || 'w'
    );
    const [currentLinesFolder, setCurrentLinesFolder] =
        useState<RepertoireFolderID | null>(searchParamLineParentFolder);
    const [showingImportModal, setShowingImportModal] = useState(false);

    return (
        <main className={styles.main}>
            <div className={styles.importExport}>
                <button onClick={() => setShowingImportModal(true)}>
                    Import repertoire
                </button>
                <ExportButton
                    dataToExport={JSON.stringify(repertoire)}
                    buttonText="Export repertoire"
                />
            </div>

            <div className={styles.repertoire}>
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
                />
                {currentOpenLine && currentLinesFolder && (
                    <LineEditor
                        id={currentOpenLine}
                        lines={lines}
                        parentFolder={currentLinesFolder}
                        closeEditor={() => setSearchParams('')}
                        currentTab={currentTab}
                    />
                )}
            </div>

            {showingImportModal && (
                <ImportModal closeModal={() => setShowingImportModal(false)} />
            )}
        </main>
    );
}
