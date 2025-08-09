import {
    type FormEvent,
    type MouseEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useOutletContext } from 'react-router';
import { FENPGNInterface } from './FENPGNInterface';
import { BoardInterface } from './BoardInterface';
import { useRepertoireChessboard } from '@/hooks/useRepertoireChessboard';
import { STANDARD_STARTING_FEN } from '@/util/constants';
import { convert } from '@/util/util';
import type { OutletContext, UUID } from '@/types/utility';
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

    const { setLineIDsToTrain } = useOutletContext<OutletContext>();
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
        if (dialogRef.current) {
            dialogRef.current.showModal();

            // Editing a line opens the board interface automatically.
            // In this situation, since no button/link/input inside the modal
            // seems like a clear autofocus target, focus the modal itself.
            // For a new line modal, the first form input is automatic and sensible.
            if (id !== 'new') {
                dialogRef.current.focus();
            }
        }

        return () => {
            // Refocus edit button used to open line editor upon close
            if (id && id !== 'new') {
                const correspondingEditButton =
                    document.querySelector<HTMLButtonElement>(
                        `#${convert.uuidToHtmlId(id)} button[aria-label="edit line"]`
                    );
                correspondingEditButton?.focus();
            }
        };
    }, [id]);

    function saveLine(e: FormEvent) {
        e.preventDefault();

        if (id === 'new') {
            lines.create(
                {
                    player: currentTab,
                    startingFEN: startingFEN,
                    PGN: moves.string,
                    notes: notes,
                },
                parentFolder
            );
        } else {
            lines.updateLine(id, {
                player: currentTab,
                startingFEN: startingFEN,
                PGN: moves.string,
                notes: notes,
            });

            // ensure if line is selected for training then edited to reset to blank PGN,
            // then it gets de-selected
            if (moves.string.length === 0) {
                setLineIDsToTrain((prev) =>
                    prev.filter((selectedID) => id !== selectedID)
                );
            }
        }
        closeEditor();
    }

    function submitNewPosition(e: FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        const startingFEN = form.elements[0] as HTMLInputElement;
        const PGN = form.elements[1] as HTMLTextAreaElement;

        const [success, newMovesList] = loadNewPosition(
            startingFEN.value || STANDARD_STARTING_FEN,
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
        <dialog
            className={styles.dialog}
            ref={dialogRef}
            onClick={(e: MouseEvent) => {
                if (e.target === e.currentTarget) {
                    closeEditor();
                }
            }}
            onClose={closeEditor}
        >
            <div className={styles.editor}>
                {editorInterface === 'FEN/PGN' ? (
                    <FENPGNInterface
                        startingFEN={startingFEN}
                        moveListString={moves.string}
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
                        startingFen={startingFEN}
                        position={position}
                        switchInterface={() => setEditorInterface('FEN/PGN')}
                        activeColour={activeColour}
                        currentTab={currentTab}
                        moveListString={moves.string}
                        moves={{ ...moves, play: playMove }}
                        saveLine={saveLine}
                        notes={notes}
                        setNotes={setNotes}
                    />
                )}
            </div>
        </dialog>
    );
}
