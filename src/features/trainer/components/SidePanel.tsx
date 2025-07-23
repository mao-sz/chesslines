import { useState } from 'react';
import { Link } from 'react-router';
import { IconButton } from '@/components/util/IconButton';
import { ICONS } from '@/util/constants';
import type { TestLine } from '@/types/repertoire';
import type { PieceName } from '@/types/chessboard';
import styles from './trainer.module.css';

type SidePanelProps = {
    successFeedback: boolean;
    errorFeedback: boolean;
    progress: number;
    linesToTrain: TestLine[];
    lineID: string;
    pieceHint: PieceName | '';
    noteHint: string;
    toNextLine: () => void;
};

export function SidePanel({
    successFeedback,
    errorFeedback,
    progress,
    linesToTrain,
    lineID,
    pieceHint,
    noteHint,
    toNextLine,
}: SidePanelProps) {
    const [showingNotes, setShowingNotes] = useState(false);
    const [showingHint, setShowingHint] = useState(false);

    const hasLinesLeft = progress < linesToTrain.length;
    const feedback =
        successFeedback || errorFeedback
            ? {
                  className: successFeedback
                      ? styles.correct
                      : styles.incorrect,
                  text: successFeedback ? 'Well done!' : 'Try again',
              }
            : null;

    return (
        <div className={styles.side}>
            <div className={styles.progress}>
                <p>
                    Line {progress}/{linesToTrain.length}
                </p>

                {hasLinesLeft && (
                    <IconButton
                        type="button"
                        ariaLabel="next line"
                        icon={ICONS.NEXT}
                        onClick={toNextLine}
                    />
                )}
            </div>

            {feedback && (
                <p
                    className={[styles.feedback, feedback.className].join(' ')}
                    aria-live="assertive"
                >
                    {feedback.text}
                </p>
            )}

            <div className={styles.hints}>
                {/* TODO: Implement "highlight piece" hint */}
                <button onClick={() => setShowingHint(true)}>Hint</button>
                <button onClick={() => setShowingNotes(!showingNotes)}>
                    {showingNotes ? 'Hide' : 'Show'} notes
                </button>
            </div>

            {showingHint && <p>{pieceHint} move</p>}

            {showingNotes && (
                <div className={styles.notes}>
                    <h2>Notes:</h2>
                    <p>{noteHint}</p>
                </div>
            )}

            <div>
                {/* TODO: Use location state to transfer line ID to open that line straight away */}
                <Link
                    className={styles.lineLink}
                    to={{ pathname: '/repertoire', search: `?line=${lineID}` }}
                    target="_blank"
                    rel="noopener"
                    aria-label="open line in new tab"
                >
                    Study line <i className={ICONS.NEW_TAB}></i>
                </Link>
            </div>
        </div>
    );
}
