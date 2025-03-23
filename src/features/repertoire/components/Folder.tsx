import { Line } from './Line';
import type { StateSetter } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';

type FolderProps = {
    id: RepertoireFolderID;
    folders: RepertoireWithMethods['folders'];
    lines: RepertoireWithMethods['lines'];
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

            {/* https://developer.mozilla.org/en-US/docs/Web/CSS/list-style#accessibility
                list-style: none removes list accessibility role in Safari */}
            <ul role="list">
                {isCurrentFolder &&
                    folder.children.map((id) =>
                        folder.contains === 'folders' ? (
                            <li key={id}>
                                <Folder
                                    id={id}
                                    folders={folders}
                                    lines={lines}
                                    isCurrentFolder={false}
                                    setCurrentFolder={setCurrentFolder}
                                />
                            </li>
                        ) : (
                            <li key={id}>
                                <Line
                                    id={id}
                                    lines={lines}
                                    loadedStartingFEN={lines[id].startingFEN}
                                    loadedPGN={lines[id].PGN}
                                />
                            </li>
                        )
                    )}
            </ul>
        </div>
    );
}
