import { LineNote } from './LineNote';
import { MoveList } from './MoveList';
import { Chessboard } from '@/components/chessboard/Chessboard';
import { IconButton } from '@/components/util/IconButton';
import { ICONS } from '@/util/constants';
import type { MouseEvent, RefObject } from 'react';
import type { Colour, MoveInfo } from '@/types/chessboard';
import type { LineNotes } from '@/types/repertoire';
import type { StateSetter } from '@/types/utility';
import styles from './editor.module.css';

type BoardInterfaceProps = {
    initialisationError: boolean;
    dialogRef: RefObject<HTMLDialogElement | null>;
    position: {
        current: string;
        currentIndex: number;
        toNth: (n: number) => void;
        toNext: () => void;
        toPrevious: () => void;
    };
    switchInterface: () => void;
    activeColour: Colour;
    currentTab: Colour;
    moveListString: string;
    playMove: (move: MoveInfo) => void;
    saveLine: (e: MouseEvent) => void;
    notes: LineNotes;
    setNotes: StateSetter<LineNotes>;
};

export function BoardInterface({
    initialisationError,
    dialogRef,
    position,
    switchInterface,
    activeColour,
    currentTab,
    moveListString,
    playMove,
    saveLine,
    notes,
    setNotes,
}: BoardInterfaceProps) {
    return initialisationError ? (
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
                    onClick={switchInterface}
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
                playMove={playMove}
            />
            <div className={styles.side}>
                <LineNote
                    notes={notes}
                    setNotes={setNotes}
                    currentMoveIndex={position.currentIndex}
                />
                <MoveList
                    moveString={moveListString}
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
                        onClick={switchInterface}
                    >
                        Load FEN/PGN
                    </button>
                    <button
                        className={styles.highlighted}
                        onClick={() => dialogRef.current?.close()}
                    >
                        Cancel
                    </button>
                    <button className={styles.highlighted} onClick={saveLine}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
