import { useState } from 'react';
import type {
    RepertoireFolders,
    RepertoireFolderID,
    RepertoireLines,
} from '@/types/repertoire';
import { UUID } from '@/types/utility';

export function useRepertoire() {
    const emptyRepertoire: RepertoireFolders = {
        w: { name: 'White', contains: 'either', children: [] },
        b: { name: 'Black', contains: 'either', children: [] },
    };
    const [folders, setFolders] = useState<RepertoireFolders>(emptyRepertoire);
    const [lines, setLines] = useState<RepertoireLines>({});

    function addFolder({
        name,
        parent,
    }: {
        name: string;
        parent: RepertoireFolderID;
    }) {
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
    }

    function addLine({
        startingFEN,
        PGN,
        parent,
    }: {
        startingFEN: string;
        PGN: string;
        parent: RepertoireFolderID;
    }) {
        const newLineUUID = crypto.randomUUID();
        const newParentFolder = {
            ...folders[parent],
            contains: 'lines',
            children: [...folders[parent].children, newLineUUID],
        };

        setLines({ ...lines, [newLineUUID]: { startingFEN, PGN } });
        setFolders({ ...folders, [parent]: newParentFolder });
    }

    function updateFolderName({
        id,
        newName,
    }: {
        id: RepertoireFolderID;
        newName: string;
    }) {
        setFolders({ ...folders, [id]: { ...folders[id], name: newName } });
    }

    function updateFolderLocation({
        idToMove,
        newParentId,
    }: {
        idToMove: UUID;
        newParentId: RepertoireFolderID;
    }) {
        const [oldParentId, oldParent] = findParentFolder(idToMove, folders);
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
    }

    function updateLineName({
        id,
        newStartingFEN,
        newPGN,
    }: {
        id: UUID;
        newStartingFEN: string;
        newPGN: string;
    }) {
        setLines({
            ...lines,
            [id]: { startingFEN: newStartingFEN, PGN: newPGN },
        });
    }

    function updateLineLocation({
        idToMove,
        newParentId,
    }: {
        idToMove: UUID;
        newParentId: RepertoireFolderID;
    }) {
        const [oldParentId, oldParent] = findParentFolder(idToMove, folders);
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
    }

    function deleteFolder(idToDelete: RepertoireFolderID): boolean {
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
    }

    function deleteLine(idToDelete: UUID) {
        const { [idToDelete]: _, ...remainingLines } = lines;
        const [oldParentId, oldParent] = findParentFolder(idToDelete, folders);
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
    }

    return {
        folders,
        lines,
        addFolder,
        addLine,
        updateFolderName,
        updateFolderLocation,
        updateLineName,
        updateLineLocation,
        deleteFolder,
        deleteLine,
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
