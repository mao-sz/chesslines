import { type FormEvent, useState } from 'react';
import { useRepertoire } from '@/hooks/useRepertoire';
import { Folder } from './components/Folder';
import { NewFolderForm } from './components/NewFolderForm';
import type { Repertoire, RepertoireFolderID } from '@/types/repertoire';
import type { Colour } from '@/types/chessboard';

type RepertoirePageProps = { repertoire: Repertoire };

export function RepertoirePage({ repertoire }: RepertoirePageProps) {
    const { folders, lines } = useRepertoire(repertoire);
    const [currentTab, setCurrentTab] = useState<Colour>('w');
    const [currentFolder, setCurrentFolder] =
        useState<RepertoireFolderID>(currentTab);
    const [isNewFolderFormShowing, setIsNewFolderFormShowing] = useState(false);

    function changeTab(colour: Colour) {
        setCurrentTab(colour);
        setCurrentFolder(colour);
    }

    function createFolder(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.elements[0] as HTMLInputElement;
        folders.create(input.value, currentFolder);
        setIsNewFolderFormShowing(false);
    }

    return (
        <>
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
                    aria-labelledby={
                        currentTab === 'w' ? 'white-tab' : 'black-tab'
                    }
                >
                    <Folder
                        id={currentFolder}
                        folders={folders}
                        lines={lines}
                        isCurrentFolder={true}
                        setCurrentFolder={setCurrentFolder}
                    />

                    {isNewFolderFormShowing ? (
                        <NewFolderForm createFolder={createFolder} />
                    ) : (
                        <>
                            {folders[currentFolder].contains !== 'lines' && (
                                <button
                                    onClick={() =>
                                        setIsNewFolderFormShowing(true)
                                    }
                                >
                                    New folder
                                </button>
                            )}
                            {folders[currentFolder].contains !== 'folders' && (
                                <button>New line</button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
