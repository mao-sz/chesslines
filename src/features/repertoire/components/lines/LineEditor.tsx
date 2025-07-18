import { type FormEvent, useEffect, useRef, useState } from 'react';
import { FENPGNInterface } from './FENPGNInterface';
import { BoardInterface } from './BoardInterface';
import { useRepertoireChessboard } from '@/hooks/useRepertoireChessboard';
import type { UUID } from '@/types/utility';
import type {
    LineNotes,
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import type { Colour, MoveInfo } from '@/types/chessboard';
import styles from './editor.module.css';

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

    const [editorInterface, setEditorInterface] = useState<'board' | 'FEN/PGN'>(
        line ? 'board' : 'FEN/PGN'
    );
    const [notes, setNotes] = useState<LineNotes>(line?.notes ?? ['']);

    const {
        initialisationError,
        setInitialisationError,
        activeColour,
        position,
        startingFEN,
        moves,
        loadNewPosition,
    } = useRepertoireChessboard(line?.PGN, line?.startingFEN);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    function saveLine(e: FormEvent) {
        e.preventDefault();

        if (id === 'new') {
            lines.create(startingFEN, moves.list, notes, parentFolder);
        } else {
            lines.updateLine(id, startingFEN, moves.list, notes);
        }
        closeEditor();
    }

    function submitNewPosition(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        const startingFEN = form.elements[0] as HTMLInputElement;
        const PGN = form.elements[1] as HTMLTextAreaElement;

        const [success, newMovesList] = loadNewPosition(
            startingFEN.value,
            PGN.value
        );

        if (success && newMovesList) {
            // +1 because of start position with no moves played yet
            setNotes(Array(newMovesList.length + 1).fill('') as LineNotes);
            setEditorInterface('board');
        }
    }

    function playMove(move: MoveInfo) {
        const notesUntilNewMove = notes.slice(
            0,
            position.currentIndex + 1
        ) as LineNotes;
        setNotes([...notesUntilNewMove, '']);
        moves.play(move);
    }

    return (
        <dialog className={styles.editor} ref={dialogRef} onClose={closeEditor}>
            {editorInterface === 'FEN/PGN' ? (
                <FENPGNInterface
                    startingFEN={startingFEN}
                    moveListString={moves.list}
                    submitNewPosition={submitNewPosition}
                    initialisationError={initialisationError}
                    clearErrors={() => setInitialisationError(false)}
                    switchInterface={() => {
                        setEditorInterface('board');
                        setInitialisationError(false);
                    }}
                />
            ) : (
                <BoardInterface
                    initialisationError={initialisationError}
                    dialogRef={dialogRef}
                    position={position}
                    switchInterface={() => setEditorInterface('FEN/PGN')}
                    activeColour={activeColour}
                    currentTab={currentTab}
                    moveListString={moves.list}
                    playMove={playMove}
                    saveLine={saveLine}
                    notes={notes}
                    setNotes={setNotes}
                />
            )}
        </dialog>
    );
}
