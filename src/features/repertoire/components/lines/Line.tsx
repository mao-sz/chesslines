import { CHARS, STANDARD_STARTING_FEN } from '@/util/constants';
import type { MouseEvent } from 'react';
import type { UUID } from '@/types/utility';
import type { RepertoireWithMethods } from '@/types/repertoire';
import styles from './lines.module.css';

type LineProps = {
    id: UUID;
    lines: RepertoireWithMethods['lines'];
    openLine: () => void;
};

export function Line({ id, lines, openLine }: LineProps) {
    const { startingFEN, PGN } = lines[id];

    const displayFEN =
        startingFEN === STANDARD_STARTING_FEN ? 'Standard' : startingFEN;

    function editLine(e: MouseEvent) {
        if ((e.target as HTMLElement).tagName === 'BUTTON') {
            return;
        }
        openLine();
    }

    function deleteLine() {
        lines.delete(id);
    }

    return (
        <li className={styles.line} onClick={editLine}>
            <p>Starting FEN: {displayFEN}</p>
            <p>PGN: {PGN}</p>

            <button type="button" aria-label="delete line" onClick={deleteLine}>
                {CHARS.CROSS}
            </button>
        </li>
    );
}
