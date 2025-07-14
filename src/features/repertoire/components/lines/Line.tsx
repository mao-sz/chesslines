import { ICONS, STANDARD_STARTING_FEN } from '@/util/constants';
import type { MouseEvent } from 'react';
import type { UUID } from '@/types/utility';
import type { RepertoireWithMethods } from '@/types/repertoire';
import styles from './lines.module.css';
import { IconButton } from '@/components/IconButton';

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

    function deleteLine(e: MouseEvent) {
        e.stopPropagation();
        lines.delete(id);
    }

    return (
        <li className={styles.line} onClick={editLine}>
            <div>
                <p>Starting FEN: {displayFEN}</p>
                <p>PGN: {PGN}</p>
            </div>

            <IconButton
                type="button"
                icon={ICONS.BIN}
                ariaLabel="delete line"
                onClick={deleteLine}
            />
        </li>
    );
}
