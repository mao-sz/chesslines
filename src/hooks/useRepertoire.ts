import { useState } from 'react';
import type {
    RepertoireFolders,
    RepertoireFolderID,
    RepertoireLines,
    RepertoireFoldersWithMethods,
    RepertoireLinesWithMethods,
} from '@/types/repertoire';
import type { UUID } from '@/types/utility';

export function useRepertoire() {
    const emptyRepertoire: RepertoireFolders = {
        w: { name: 'White', contains: 'either', children: [] },
        b: { name: 'Black', contains: 'either', children: [] },
    };
    const [folders, setFolders] = useState<RepertoireFolders>(emptyRepertoire);
    const [lines, setLines] = useState<RepertoireLines>({});

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

            setFolders({
                ...folders,
                [oldParentId]: {
                    ...oldParent,
                    contains: oldParentChildrenWithoutFolder.length
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

            setFolders({
                ...remainingFolders,
                [oldParentId]: {
                    ...oldParent,
                    contains: oldParentChildrenWithoutFolder.length
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
            startingFEN: string,
            PGN: string,
            parent: RepertoireFolderID
        ): void {
            const newLineUUID = crypto.randomUUID();
            const newParentFolder = {
                ...folders[parent],
                contains: 'lines',
                children: [...folders[parent].children, newLineUUID],
            };

            setLines({ ...lines, [newLineUUID]: { startingFEN, PGN } });
            setFolders({ ...folders, [parent]: newParentFolder });
        },
        updateLine(id: UUID, newStartingFEN: string, newPGN: string): void {
            setLines({
                ...lines,
                [id]: { startingFEN: newStartingFEN, PGN: newPGN },
            });
        },
        updateLocation(idToMove: UUID, newParentId: RepertoireFolderID): void {
            const [oldParentId, oldParent] = findParentFolder(
                idToMove,
                folders
            );
            const oldParentChildrenWithoutLine = oldParent.children.filter(
                (ids) => ids !== idToMove
            );

            setFolders({
                ...folders,
                [oldParentId]: {
                    ...oldParent,
                    contains: oldParentChildrenWithoutLine.length
                        ? lines
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

    return {
        folders: folders as RepertoireFoldersWithMethods,
        lines: lines as RepertoireLinesWithMethods,
    };
}

function findParentFolder(
    childId: UUID,
    folders: RepertoireFolders
): [string, RepertoireFolders[RepertoireFolderID]] {
    return Object.entries(folders).find(
        ([_, folder]) =>
            folder.contains !== 'either' && folder.children.includes(childId)
    )!;
}
