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

    function playMove(move: MoveInfo) {
        moves.play(move);
    }

    function saveLine(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        const startingFEN = (form.elements[0] as HTMLInputElement).value;
        const PGN = (form.elements[1] as HTMLTextAreaElement).value;

        if (id === 'new') {
            lines.create(startingFEN, PGN, parentFolder);
        } else {
            lines.updateLine(id, startingFEN, PGN);
        }
        closeEditor();
    }

    return (
        <dialog ref={dialogRef} onClose={closeEditor}>
            <Chessboard
                position={position.current}
                playerColour={activeColour}
                orientation={currentTab}
                playMove={playMove}
            />
            <form method="dialog" onSubmit={saveLine}>
                <label>
                    Starting FEN{' '}
                    <input name="startingFEN" defaultValue={startingFEN} />
                </label>
                <label>
                    PGN <textarea name="PGN" defaultValue={currentPGN} />
                </label>
                <button type="submit">Save</button>
            </form>
            <IconButton
                type="button"
                icon={ICONS.CROSS}
                ariaLabel="close line editor"
                onClick={() => dialogRef.current?.close()}
            />
        </dialog>
    );
}
