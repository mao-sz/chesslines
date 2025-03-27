import { useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { FolderPanel } from './components/folders/FolderPanel';
import { LinePanel } from './components/lines/LinePanel';
import type { Repertoire, RepertoireFolderID } from '@/types/repertoire';

type RepertoirePageProps = { repertoire: Repertoire };

export function RepertoirePage({ repertoire }: RepertoirePageProps) {
    const { folders, lines } = useRepertoire(repertoire);
    const [currentLinesFolder, setCurrentLinesFolder] =
        useState<RepertoireFolderID | null>(null);

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
            />
        </main>
    );
}
