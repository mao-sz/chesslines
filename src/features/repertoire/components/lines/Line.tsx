import { IconButton } from '@/components/util/IconButton';
import { ICONS, STANDARD_STARTING_FEN } from '@/util/constants';
import type { DragEvent, MouseEvent } from 'react';
import type { UUID } from '@/types/utility';
import type { RepertoireWithMethods } from '@/types/repertoire';
import styles from './lines.module.css';
import { convert } from '@/util/util';

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

    function startDrag(e: DragEvent) {
        // prevent dragging ancestor folders along with it
        e.stopPropagation();
        e.dataTransfer.clearData();
        e.dataTransfer.setData('text/plain', `line ${id}`);
        e.dataTransfer.effectAllowed = 'move';
    }

    return (
        <li
            id={convert.uuidToId(id)}
            className={styles.line}
            onClick={editLine}
            draggable={true}
            onDragStart={startDrag}
            data-type="line"
        >
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
