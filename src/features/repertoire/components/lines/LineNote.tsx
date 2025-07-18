import type { ChangeEvent } from 'react';
import type { LineNotes } from '@/types/repertoire';
import type { StateSetter } from '@/types/utility';
import styles from './editor.module.css';

type LineNoteProps = {
    notes: LineNotes;
    setNotes: StateSetter<LineNotes>;
    currentMoveIndex: number;
};

export function LineNote({ notes, setNotes, currentMoveIndex }: LineNoteProps) {
    function setNoteText(e: ChangeEvent) {
        const textArea = e.target as HTMLTextAreaElement;
        setNotes((oldNotes) => {
            const newNotes: LineNotes = [...oldNotes];
            newNotes[currentMoveIndex] = textArea.value;
            return newNotes;
        });
    }

    return (
        <div className={styles.notes}>
            <label className={styles.heading} htmlFor="notes">
                Notes:
            </label>
            <textarea
                id="notes"
                className={`${styles.textbox} ${styles.noteText}`}
                name="notes"
                aria-label="notes"
                value={notes[currentMoveIndex]}
                onChange={setNoteText}
                autoFocus
            ></textarea>
        </div>
    );
}
