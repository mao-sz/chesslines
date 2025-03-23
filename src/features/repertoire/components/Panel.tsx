import { type FormEvent, useState } from 'react';
import { Folder } from './Folder';
import { NewFolderForm } from './NewFolderForm';
import type { StateSetter } from '@/types/utility';
import type { Colour } from '@/types/chessboard';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';

type PanelProps = {
    folders: RepertoireWithMethods['folders'];
    lines: RepertoireWithMethods['lines'];
    currentFolder: RepertoireFolderID;
    currentTab: Colour;
    setCurrentFolder: StateSetter<RepertoireFolderID>;
};

export function Panel({
    folders,
    lines,
    currentFolder,
    currentTab,
    setCurrentFolder,
}: PanelProps) {
    const [isNewFolderFormShowing, setIsNewFolderFormShowing] = useState(false);

    function createFolder(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.elements[0] as HTMLInputElement;
        folders.create(input.value, currentFolder);
        setIsNewFolderFormShowing(false);
    }

    return (
        <div
            role="tabpanel"
            aria-labelledby={currentTab === 'w' ? 'white-tab' : 'black-tab'}
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
                        <button onClick={() => setIsNewFolderFormShowing(true)}>
                            New folder
                        </button>
                    )}
                    {folders[currentFolder].contains !== 'folders' && (
                        <button>New line</button>
                    )}
                </>
            )}
        </div>
    );
}
