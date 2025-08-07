import { useOutletContext } from 'react-router';
import type { Repertoire, RepertoireFolderID } from '@/types/repertoire';
import type { OutletContext, UUID } from '@/types/utility';
import { useMemo } from 'react';

export function useDeepContainsSelectedLine(
    folders: Repertoire['folders'],
    baseFolderID: RepertoireFolderID
): boolean {
    const { lineIDsToTrain } = useOutletContext<OutletContext>();
    return useMemo(
        () => deepContainsSelectedLine(folders, baseFolderID, lineIDsToTrain),
        [folders, baseFolderID, lineIDsToTrain]
    );
}

function deepContainsSelectedLine(
    folders: Repertoire['folders'],
    baseFolderID: RepertoireFolderID,
    lineIDsToTrain: UUID[]
): boolean {
    const folder = folders[baseFolderID];
    switch (folder.contains) {
        case 'either':
            return false;
        case 'lines':
            return folder.children.some((id) => lineIDsToTrain.includes(id));
        case 'folders':
            for (const folderID of folder.children) {
                if (
                    deepContainsSelectedLine(folders, folderID, lineIDsToTrain)
                ) {
                    return true;
                }
            }
            return false;
    }
}
