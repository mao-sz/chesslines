import type { FormEvent } from 'react';
import styles from './editor.module.css';

type FENPGNInterfaceProps = {
    startingFEN: string;
    moveListString: string;
    submitNewPosition: (e: FormEvent) => void;
    initialisationError: boolean;
    clearErrors: () => void;
    switchInterface: () => void;
};

export function FENPGNInterface({
    startingFEN,
    moveListString,
    submitNewPosition,
    initialisationError,
    clearErrors,
    switchInterface,
}: FENPGNInterfaceProps) {
    return (
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
                    onChange={clearErrors}
                />
            </label>
            <label className={styles.pgn}>
                PGN (no tag pairs){' '}
                <textarea
                    className={styles.textbox}
                    name="PGN"
                    defaultValue={moveListString}
                    onChange={clearErrors}
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
                <button type="button" onClick={switchInterface}>
                    Cancel
                </button>
                <button type="submit">Load</button>
            </div>
        </form>
    );
}
