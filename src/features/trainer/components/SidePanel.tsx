import { useState } from 'react';
import { Link } from 'react-router';
import { IconButton } from '@/components/util/IconButton';
import { ICONS } from '@/util/constants';
import type { TestLine } from '@/types/repertoire';
import styles from './trainer.module.css';

type SidePanelProps = {
    progress: number;
    linesToTrain: TestLine[];
    lineID: string;
    noteHint: string;
    currentMoveIndex: number;
    toNextLine: () => void;
};

export function SidePanel({
    progress,
    linesToTrain,
    lineID,
    notes,
    noteHint,
    toNextLine,
}: SidePanelProps) {
    const [showingNotes, setShowingNotes] = useState(false);
    const hasLinesLeft = progress < linesToTrain.length;

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

            <div className={styles.hints}>
                {/* TODO: Implement "highlight piece" hint */}
                <button>Highlight piece</button>
                <button onClick={() => setShowingNotes(!showingNotes)}>
                    {showingNotes ? 'Hide' : 'Show'} notes
                </button>
            </div>

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
                    to="/repertoire"
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
