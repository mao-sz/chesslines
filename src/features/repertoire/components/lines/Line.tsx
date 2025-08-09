import { useOutletContext } from 'react-router';
import { ConfirmableButton } from '@/components/util/ConfirmableButton';
import { IconButton } from '@/components/util/IconButton';
import { ICONS, STANDARD_STARTING_FEN } from '@/util/constants';
import { convert } from '@/util/util';
import type { ChangeEvent, DragEvent, MouseEvent } from 'react';
import type { OutletContext, StateSetter, UUID } from '@/types/utility';
import type { RepertoireWithMethods } from '@/types/repertoire';
import styles from './lines.module.css';

type LineProps = {
    id: UUID;
    lines: RepertoireWithMethods['lines'];
    openLine: () => void;
    setSelectedFolderLines: StateSetter<UUID[]>;
};

export function Line({
    id,
    lines,
    openLine,
    setSelectedFolderLines,
}: LineProps) {
    const { startingFEN, PGN } = lines[id];
    const { lineIDsToTrain, setLineIDsToTrain } =
        useOutletContext<OutletContext>();

    const isStandardStartingFEN = startingFEN === STANDARD_STARTING_FEN;
    const listItemID = convert.uuidToHtmlId(id);
    const checkboxID = `${listItemID}-input`;

    function deleteLine(e: MouseEvent) {
        e.stopPropagation();
        lines.delete(id);
        setLineIDsToTrain(
            lineIDsToTrain.filter((selectedID) => selectedID !== id)
        );
    }

    function startDrag(e: DragEvent) {
        // prevent dragging ancestor folders along with it
        e.stopPropagation();
        e.dataTransfer.clearData();
        e.dataTransfer.setData('text/plain', `line ${id}`);
        e.dataTransfer.effectAllowed = 'move';
    }

    function toggleSelected(e: ChangeEvent) {
        // Prevent selecting lines that do not have moves set
        if (!PGN) {
            return;
        }

        const checkbox = e.currentTarget as HTMLInputElement;
        if (checkbox.checked) {
            setLineIDsToTrain([...lineIDsToTrain, id]);
            setSelectedFolderLines((prev) => [...prev, id]);
        } else {
            setLineIDsToTrain(
                lineIDsToTrain.filter((selectedID) => selectedID !== id)
            );
            setSelectedFolderLines((prev) =>
                prev.filter((selectedID) => selectedID !== id)
            );
        }
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
                checked={lineIDsToTrain.includes(id)}
                onChange={toggleSelected}
                disabled={!PGN}
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
                <ConfirmableButton handleConfirm={deleteLine}>
                    <IconButton
                        type="button"
                        icon={ICONS.BIN}
                        ariaLabel="delete line"
                    />
                </ConfirmableButton>
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
