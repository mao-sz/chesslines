import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Chessboard } from '@/components/Chessboard';
import { useRepertoireChessboard } from '@/hooks/useRepertoireChessboard';
import type { UUID } from '@/types/utility';
import { MoveList } from './MoveList';
import type {
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

    const { activeColour, position, startingFEN, moves, loadNewPosition } =
        useRepertoireChessboard(line?.PGN, line?.startingFEN);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    function saveLine(e: FormEvent) {
        e.preventDefault();

        if (id === 'new') {
            lines.create(startingFEN, moves.list, parentFolder);
        } else {
            lines.updateLine(id, startingFEN, moves.list);
        }
        closeEditor();
    }

    function submitNewPosition(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        const startingFEN = (form.elements[0] as HTMLInputElement).value;
        const PGN = (form.elements[1] as HTMLTextAreaElement).value;

        // TODO: Validate position/PGN!
        loadNewPosition(startingFEN, PGN);
        setEditorInterface('board');
    }

    return (
        <dialog className={styles.editor} ref={dialogRef} onClose={closeEditor}>
            {editorInterface === 'board' ? (
                <div className={styles.boardEditor}>
                    <Chessboard
                        boardSizeClass={styles.boardSize}
                        position={position.current}
                        playerColour={activeColour}
                        orientation={currentTab}
                        playMove={(move: MoveInfo) => moves.play(move)}
                    />
                    <div className={styles.side}>
                        <MoveList
                            moveString={moves.list}
                            highlightedMoveIndex={position.currentIndex}
                        />
                        <div className={styles.buttons}>
                            <button
                                className={styles.highlighted}
                                onClick={() => setEditorInterface('FEN/PGN')}
                            >
                                Load FEN/PGN
                            </button>
                            <button
                                className={styles.highlighted}
                                onClick={() => dialogRef.current?.close()}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.highlighted}
                                onClick={saveLine}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <form
                    className={styles.fenPngEditor}
                    method="dialog"
                    onSubmit={submitNewPosition}
                >
                    <label>
                        Starting FEN{' '}
                        <input name="startingFEN" defaultValue={startingFEN} />
                    </label>
                    <label>
                        PGN <textarea name="PGN" defaultValue={moves.list} />
                    </label>
                    <button
                        type="button"
                        onClick={() => setEditorInterface('board')}
                    >
                        Cancel
                    </button>
                    <button type="submit">Load</button>
                </form>
            )}
        </dialog>
    );
}
