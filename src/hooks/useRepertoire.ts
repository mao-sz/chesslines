import { useState } from 'react';
import { LOCAL_STORAGE } from '@/util/localStorage';
import type {
    Repertoire,
    RepertoireWithMethods,
    RepertoireFolderID,
    RepertoireLine,
    RepertoireFolder,
} from '@/types/repertoire';
import type { UUID } from '@/types/utility';

export function useRepertoire(repertoire: Repertoire) {
    const [folders, setFolders] = useState<Repertoire['folders']>(
        repertoire.folders
    );
    const [lines, setLines] = useState<Repertoire['lines']>(repertoire.lines);

    LOCAL_STORAGE.repertoire.set({ folders, lines });

    const folderMethods = {
        create(name: string, parent: RepertoireFolderID): void {
            const newFolderUUID = crypto.randomUUID();
            const newFolder = { name: name, contains: 'either', children: [] };
            const newParent = {
                ...folders[parent],
                contains: 'folders',
                children: [...folders[parent].children, newFolderUUID],
            };

            setFolders({
                ...folders,
                [parent]: newParent,
                [newFolderUUID]: newFolder,
            });
        },
        updateName(id: RepertoireFolderID, newName: string): void {
            setFolders({ ...folders, [id]: { ...folders[id], name: newName } });
        },
        updateLocation(idToMove: UUID, newParentId: RepertoireFolderID): void {
            const [oldParentId, oldParent] = findParentFolder(
                idToMove,
                folders
            );
            const oldParentChildrenWithoutFolder = oldParent.children.filter(
                (ids) => ids !== idToMove
            );
            const isBaseFolder = oldParentId === 'w' || oldParentId === 'b';

            setFolders({
                ...folders,
                [oldParentId]: {
                    ...oldParent,
                    contains:
                        isBaseFolder || oldParentChildrenWithoutFolder.length
                            ? 'folders'
                            : 'either',
                    children: oldParentChildrenWithoutFolder,
                },
                [newParentId]: {
                    ...folders[newParentId],
                    contains: 'folders',
                    children: [...folders[newParentId].children, idToMove],
                },
            });
        },
        delete(idToDelete: RepertoireFolderID): boolean {
            // Prevent deleting the base w/b folders
            // Prevent deleting any other folder unless empty
            if (
                idToDelete === 'w' ||
                idToDelete === 'b' ||
                folders[idToDelete].children.length
            ) {
                return false;
            }

            const { [idToDelete]: _, ...remainingFolders } = folders;
            const [oldParentId, oldParent] = findParentFolder(
                idToDelete,
                remainingFolders
            );
            const oldParentChildrenWithoutFolder = oldParent.children.filter(
                (ids) => ids !== idToDelete
            );
            const isBaseFolder = oldParentId === 'w' || oldParentId === 'b';

            setFolders({
                ...remainingFolders,
                [oldParentId]: {
                    ...oldParent,
                    contains:
                        isBaseFolder || oldParentChildrenWithoutFolder.length
                            ? 'folders'
                            : 'either',
                    children: oldParentChildrenWithoutFolder,
                },
            });
            return true;
        },
    };
    const lineMethods = {
        create(
            { player, startingFEN, PGN, notes }: RepertoireLine,
            parent: UUID
        ): void {
            const newLineUUID = crypto.randomUUID();
            const newParentFolder = {
                ...folders[parent],
                contains: 'lines',
                children: [...folders[parent].children, newLineUUID],
            };

            setLines({
                ...lines,
                [newLineUUID]: { player, startingFEN, PGN, notes },
            });
            setFolders({ ...folders, [parent]: newParentFolder });
        },
        updateLine(
            id: UUID,
            { player, startingFEN, PGN, notes }: RepertoireLine
        ): void {
            setLines({ ...lines, [id]: { player, startingFEN, PGN, notes } });
        },
        updateLocation(idToMove: UUID, newParentId: UUID): void {
            const [oldParentId, oldParent] = findParentFolder(
                idToMove,
                folders
            );
            const oldParentChildrenWithoutLine = oldParent.children.filter(
                (id) => id !== idToMove
            );

            setFolders({
                ...folders,
                [oldParentId]: {
                    ...oldParent,
                    contains: oldParentChildrenWithoutLine.length
                        ? 'lines'
                        : 'either',
                    children: oldParentChildrenWithoutLine,
                },
                [newParentId]: {
                    ...folders[newParentId],
                    contains: 'lines',
                    children: [...folders[newParentId].children, idToMove],
                },
            });
        },
        delete(idToDelete: UUID): void {
            const { [idToDelete]: _, ...remainingLines } = lines;
            const [oldParentId, oldParent] = findParentFolder(
                idToDelete,
                folders
            );
            const oldParentChildrenWithoutLine = oldParent.children.filter(
                (ids) => ids !== idToDelete
            );

            setFolders({
                ...folders,
                [oldParentId]: {
                    ...oldParent,
                    contains: oldParentChildrenWithoutLine.length
                        ? 'lines'
                        : 'either',
                    children: oldParentChildrenWithoutLine,
                },
            });

            setLines(remainingLines);
        },
    };

    Object.setPrototypeOf(folders, folderMethods);
    Object.setPrototypeOf(lines, lineMethods);

    return { folders, lines } as RepertoireWithMethods;
}

function findParentFolder(
    childId: UUID,
    folders: Repertoire['folders']
): [string, RepertoireFolder] {
    return Object.entries(folders).find(
        ([_, folder]) =>
            folder.contains !== 'either' && folder.children.includes(childId)
    )!;
}
