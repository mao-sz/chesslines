import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Chessboard } from '@/components/chessboard/Chessboard';
import { IconButton } from '@/components/util/IconButton';
import { useRepertoireChessboard } from '@/hooks/useRepertoireChessboard';
import type { UUID } from '@/types/utility';
import { MoveList } from './MoveList';
import type {
    RepertoireFolderID,
    RepertoireWithMethods,
} from '@/types/repertoire';
import type { Colour, MoveInfo } from '@/types/chessboard';
import styles from './editor.module.css';
import { ICONS } from '@/util/constants';

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
            lines.create(startingFEN, moves.list, parentFolder);
        } else {
            lines.updateLine(id, startingFEN, moves.list);
        }
        closeEditor();
    }

    function submitNewPosition(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        const startingFEN = form.elements[0] as HTMLInputElement;
        const PGN = form.elements[1] as HTMLTextAreaElement;

        const success = loadNewPosition(startingFEN.value, PGN.value);
        if (success) {
            setEditorInterface('board');
        }
    }

    function returnToBoardInterface() {
        setEditorInterface('board');
        setInitialisationError(false);
    }

    return (
        <dialog className={styles.editor} ref={dialogRef} onClose={closeEditor}>
            {editorInterface === 'FEN/PGN' ? (
                <form
                    className={styles.fenPngEditor}
                    method="dialog"
                    onSubmit={submitNewPosition}
                >
                    <label className={styles.fen}>
                        Starting FEN{' '}
                        <input
                            className={styles.textbox}
                            name="startingFEN"
                            defaultValue={startingFEN}
                            onChange={() => setInitialisationError(false)}
                        />
                    </label>
                    <label className={styles.pgn}>
                        PGN (no tag pairs){' '}
                        <textarea
                            className={styles.textbox}
                            name="PGN"
                            defaultValue={moves.list}
                            onChange={() => setInitialisationError(false)}
                        />
                    </label>
                    <div
                        className={styles.buttons}
                        aria-live="assertive"
                        aria-relevant="additions"
                    >
                        {initialisationError && (
                            <p className={styles.error}>
                                Invalid FEN and/or PGN combination!
                            </p>
                        )}
                        <button type="button" onClick={returnToBoardInterface}>
                            Cancel
                        </button>
                        <button type="submit">Load</button>
                    </div>
                </form>
            ) : initialisationError ? (
                <div className={styles.invalid}>
                    <p className={styles.error} aria-live="polite">
                        Invalid FEN and/or PGN combination!
                    </p>
                    <div className={styles.buttons}>
                        <button
                            className={styles.highlighted}
                            onClick={() => dialogRef.current?.close()}
                        >
                            Close
                        </button>
                        <button
                            className={styles.highlighted}
                            onClick={() => setEditorInterface('FEN/PGN')}
                        >
                            Fix FEN/PGN
                        </button>
                    </div>
                </div>
            ) : (
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
                            goToPosition={position.toNth}
                        />
                        <div className={`${styles.buttons} ${styles.controls}`}>
                            <IconButton
                                type="button"
                                icon={ICONS.START}
                                ariaLabel="skip to first move"
                                onClick={() => position.toNth(0)}
                            />
                            <IconButton
                                type="button"
                                icon={ICONS.PREVIOUS}
                                ariaLabel="previous move"
                                onClick={position.toPrevious}
                            />
                            <IconButton
                                type="button"
                                icon={ICONS.NEXT}
                                ariaLabel="next move"
                                onClick={position.toNext}
                            />
                            <IconButton
                                type="button"
                                icon={ICONS.END}
                                ariaLabel="skip to last move"
                                onClick={() => position.toNth(Infinity)}
                            />
                        </div>
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
            )}
        </dialog>
    );
}
