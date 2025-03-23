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

const STANDARD_STARTING_FEN =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

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

    function createLine() {
        lines.create(STANDARD_STARTING_FEN, '', currentFolder);
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
                        <button onClick={createLine}>New line</button>
                    )}
                </>
            )}
        </div>
    );
}
