import { Line } from './Line';
import type { StateSetter } from '@/types/utility';
import type { RepertoireFolderID, Repertoire } from '@/types/repertoire';

type FolderProps = {
    id: RepertoireFolderID;
    folders: Repertoire['folders'];
    lines: Repertoire['lines'];
    isCurrentFolder: boolean;
    setCurrentFolder: StateSetter<RepertoireFolderID>;
};

export function Folder({
    id,
    folders,
    lines,
    isCurrentFolder,
    setCurrentFolder,
}: FolderProps) {
    const folder = folders[id];

    return (
        <div aria-label={`${folder.name} folder`}>
            <h2>{folder.name}</h2>
            {isCurrentFolder &&
                folder.children.map((id) =>
                    folder.contains === 'folders' ? (
                        <Folder
                            key={id}
                            id={id}
                            folders={folders}
                            lines={lines}
                            isCurrentFolder={false}
                            setCurrentFolder={setCurrentFolder}
                        />
                    ) : (
                        <Line
                            key={id}
                            loadedStartingFEN={lines[id].startingFEN}
                            loadedPGN={lines[id].PGN}
                        />
                    )
                )}
        </div>
    );
}
