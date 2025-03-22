import { Line } from './Line';
import type { StateSetter } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireFolders,
    RepertoireLines,
} from '@/types/repertoire';

type FolderProps = {
    id: RepertoireFolderID;
    folders: RepertoireFolders;
    lines: RepertoireLines;
    setCurrentFolder: StateSetter<RepertoireFolderID>;
};

export function Folder({ id, folders, lines, setCurrentFolder }: FolderProps) {
    const folder = folders[id];

    return (
        <div>
            <h2>{folder.name}</h2>
            {folder.children.map((id) =>
                folder.contains === 'folders' ? (
                    <Folder
                        key={id}
                        id={id}
                        folders={folders}
                        lines={lines}
                        setCurrentFolder={setCurrentFolder}
                    />
                ) : (
                    <Line
                        key={id}
                        loadedStartingFEN={lines[id].startingFEN}
                        loadedPGN={lines[id].pgn}
                    />
                )
            )}
        </div>
    );
}
