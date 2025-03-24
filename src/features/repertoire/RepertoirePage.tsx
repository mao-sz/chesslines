import { useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { Tabs } from './components/Tabs';
import { Folder } from './components/Folder';
import type { Repertoire } from '@/types/repertoire';
import type { Colour } from '@/types/chessboard';

type RepertoirePageProps = { repertoire: Repertoire };

export function RepertoirePage({ repertoire }: RepertoirePageProps) {
    const { folders, lines } = useRepertoire(repertoire);
    const [currentTab, setCurrentTab] = useState<Colour>('w');

    return (
        <main>
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

            <div
                role="tabpanel"
                aria-labelledby={currentTab === 'w' ? 'white-tab' : 'black-tab'}
            >
                <Folder id={currentTab} lines={lines} folders={folders} />
            </div>
        </main>
    );
}
