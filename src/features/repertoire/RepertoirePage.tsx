import { useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { FolderPanel } from './components/folders/FolderPanel';
import { LinePanel } from './components/lines/LinePanel';
import type { UUID } from '@/types/utility';
import type { Repertoire, RepertoireFolderID } from '@/types/repertoire';
import { LineEditor } from './components/lines/LineEditor';

type RepertoirePageProps = { repertoire: Repertoire };

export function RepertoirePage({ repertoire }: RepertoirePageProps) {
    const { folders, lines } = useRepertoire(repertoire);
    const [currentLinesFolder, setCurrentLinesFolder] =
        useState<RepertoireFolderID | null>(null);
    const [currentOpenLine, setCurrentOpenLine] = useState<UUID | 'new' | null>(
        null
    );

    return (
        <main>
            <FolderPanel
                folders={folders}
                currentLinesFolder={currentLinesFolder}
                setCurrentLinesFolder={setCurrentLinesFolder}
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
                />
            )}
        </main>
    );
}
