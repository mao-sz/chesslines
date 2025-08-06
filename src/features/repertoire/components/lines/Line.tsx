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

    const isStandardStartingFEN = startingFEN === STANDARD_STARTING_FEN;
    const listItemID = convert.uuidToId(id);
    const checkboxID = `${listItemID}-input`;

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
            id={listItemID}
            className={styles.line}
            draggable={true}
            onDragStart={startDrag}
            data-type="line"
        >
            <input
                id={checkboxID}
                className={styles.checkbox}
                name={checkboxID}
                type="checkbox"
            />
            <div className={styles.contents}>
                {/* Absolutely positioned to allow clicking on "card" to check checkbox */}
                <label
                    className={styles.label}
                    htmlFor={checkboxID}
                    aria-label={`load line in trainer ${PGN}`}
                ></label>

                <p>{PGN || 'No moves set'}</p>
                {!isStandardStartingFEN && (
                    <p className={styles.fen}>
                        <span className={styles.bold}>
                            Custom starting FEN:
                        </span>
                        <br />
                        {startingFEN}
                    </p>
                )}
            </div>

            <div className={styles.buttons}>
                <IconButton
                    type="button"
                    icon={ICONS.BIN}
                    ariaLabel="delete line"
                    onClick={deleteLine}
                />
                <IconButton
                    type="button"
                    icon={ICONS.PENCIL}
                    ariaLabel="edit line"
                    onClick={openLine}
                />
            </div>
        </li>
    );
}
