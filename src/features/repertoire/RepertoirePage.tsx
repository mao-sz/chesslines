import { useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { Folder } from './components/Folder';
import type { Repertoire, RepertoireFolderID } from '@/types/repertoire';
import type { Colour } from '@/types/chessboard';

type RepertoirePageProps = { repertoire: Repertoire };

export function RepertoirePage({ repertoire }: RepertoirePageProps) {
    const { folders, lines } = useRepertoire(repertoire);
    const [currentTab, setCurrentTab] = useState<Colour>('w');
    const [currentFolder, setCurrentFolder] =
        useState<RepertoireFolderID>(currentTab);

    function changeTab(colour: Colour) {
        setCurrentTab(colour);
        setCurrentFolder(colour);
    }

    return (
        <div role="tablist">
            <button
                id="white-tab"
                role="tab"
                aria-label="white repertoire"
                aria-selected={currentTab === 'w'}
                onClick={() => changeTab('w')}
            >
                White
            </button>
            <button
                id="black-tab"
                role="tab"
                aria-label="black repertoire"
                aria-selected={currentTab === 'b'}
                onClick={() => changeTab('b')}
            >
                Black
            </button>
            <div
                role="tabpanel"
                aria-labelledby={currentTab === 'w' ? 'white-tab' : 'black-tab'}
            >
                <Folder
                    id={currentFolder}
                    folders={folders}
                    lines={lines}
                    setCurrentFolder={setCurrentFolder}
                />
            </div>
        </div>
    );
}
