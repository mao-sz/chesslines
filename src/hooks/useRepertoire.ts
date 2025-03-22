import { useState } from 'react';
import type {
    RepertoireFolders,
    RepertoireFolderID,
    RepertoireLines,
} from '@/types/repertoire';

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
        pgn,
        parent,
    }: {
        startingFEN: string;
        pgn: string;
        parent: RepertoireFolderID;
    }) {
        const newLineUUID = crypto.randomUUID();
        const newParentFolder = {
            ...folders[parent],
            contains: 'lines',
            children: [...folders[parent].children, newLineUUID],
        };

        setLines({ ...lines, [newLineUUID]: { startingFEN, pgn } });
        setFolders({ ...folders, [parent]: newParentFolder });
    }

    return { folders, lines, addFolder, addLine };
}
