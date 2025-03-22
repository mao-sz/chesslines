import { useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { Folder } from './components/Folder';
import type { RepertoireFolderID } from '@/types/repertoire';

export function RepertoirePage() {
    const { folders, lines } = useRepertoire();
    const [currentFolder, setCurrentFolder] = useState<RepertoireFolderID>('w');

    return (
        <Folder
            id={currentFolder}
            folders={folders}
            lines={lines}
            setCurrentFolder={setCurrentFolder}
        />
    );
}
