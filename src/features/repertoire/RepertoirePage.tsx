import { useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { Tabs } from './components/Tabs';
import { Panel } from './components/Panel';
import type { Repertoire, RepertoireFolderID } from '@/types/repertoire';
import type { Colour } from '@/types/chessboard';

type RepertoirePageProps = { repertoire: Repertoire };

export function RepertoirePage({ repertoire }: RepertoirePageProps) {
    const { folders, lines } = useRepertoire(repertoire);
    const [currentTab, setCurrentTab] = useState<Colour>('w');
    const [currentFolder, setCurrentFolder] =
        useState<RepertoireFolderID>(currentTab);

    return (
        <main>
            <Tabs
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                setCurrentFolder={setCurrentFolder}
            />
            <Panel
                folders={folders}
                lines={lines}
                currentFolder={currentFolder}
                currentTab={currentTab}
                setCurrentFolder={setCurrentFolder}
            />
        </main>
    );
}
