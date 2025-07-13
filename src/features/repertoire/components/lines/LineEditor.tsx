import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Chessboard } from '@/components/Chessboard';
import { useRepertoireChessboard } from '@/hooks/useRepertoireChessboard';
import { ICONS } from '@/util/constants';
import type { UUID } from '@/types/utility';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import type { Colour, MoveInfo } from '@/types/chessboard';
import { IconButton } from '@/components/IconButton';
import { MoveList } from './MoveList';

type LineEditorProps = {
    id: UUID | 'new';
    lines: RepertoireWithMethods['lines'];
    parentFolder: RepertoireFolderID;
    closeEditor: () => void;
    currentTab: Colour;
};

export function LineEditor({
    id,
    lines,
    parentFolder,
    closeEditor,
    currentTab,
}: LineEditorProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const line = id === 'new' ? null : lines[id];

    const { activeColour, position, startingFEN, currentPGN, moves } =
        useRepertoireChessboard(line?.PGN, line?.startingFEN);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    function saveLine(e: FormEvent) {
        e.preventDefault();

        if (id === 'new') {
            lines.create(startingFEN, currentPGN, parentFolder);
        } else {
            lines.updateLine(id, startingFEN, currentPGN);
        }
        closeEditor();
    }

    return (
        <dialog ref={dialogRef} onClose={closeEditor}>
            <Chessboard
                position={position.current}
                playerColour={activeColour}
                orientation={currentTab}
                playMove={(move: MoveInfo) => moves.play(move)}
            />
            <MoveList
                moveString={moves.list}
                highlightedMoveIndex={position.currentIndex}
            />
            <button onClick={() => dialogRef.current?.close()}>Cancel</button>
            <button onClick={saveLine}>Save</button>
        </dialog>
    );
}
