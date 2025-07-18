import { useEffect, useRef } from 'react';
import styles from './editor.module.css';

type MoveListProps = {
    moveString: string;
    highlightedMoveIndex: number;
    goToPosition: (n: number) => void;
};

export function MoveList({
    moveString,
    highlightedMoveIndex,
    goToPosition,
}: MoveListProps) {
    const moveListRef = useRef<HTMLOListElement>(null);

    useEffect(() => {
        if (moveListRef.current) {
            moveListRef.current.scrollTop = moveListRef.current.scrollHeight;
        }
    }, [moveString]);

    // https://regexr.com/8g0go to test this regex
    const moves = moveString.split(/\s(?=\d)/);
    // maps to game history state (where 0 is the starting position)
    // hence moves are effectively 1-indexed
    let moveIndex = 1;

    return (
        <div>
            <h3 className={styles.heading}>Moves:</h3>
            <ol
                className={styles.moveList}
                aria-label="moves"
                ref={moveListRef}
            >
                {moves.map((fullMove) => {
                    const [moveNumber, firstMove, secondMove] =
                        fullMove.split(' ');
                    const blackMoveOnly = moveNumber.endsWith('...');

                    const white = {
                        move: blackMoveOnly ? null : firstMove,
                        index: moveIndex,
                        isHighlighted: moveIndex === highlightedMoveIndex,
                    };
                    if (white.move) {
                        moveIndex++;
                    }

                    const black = {
                        move: blackMoveOnly ? firstMove : secondMove,
                        index: moveIndex,
                        isHighlighted: moveIndex === highlightedMoveIndex,
                    };
                    moveIndex++;

                    return (
                        <li
                            key={moveNumber}
                            className={styles.fullMove}
                            aria-label={`full move ${moveNumber}`}
                        >
                            {moveNumber}
                            {white.move && (
                                <button
                                    data-moveindex={white.index}
                                    className={`${styles.whiteMove} ${white.isHighlighted ? styles.highlighted : ''}`}
                                    onClick={() => goToPosition(white.index)}
                                    aria-label={`white full move ${moveNumber} ${white.move}`}
                                >
                                    {white.move}
                                </button>
                            )}
                            {black.move && (
                                <button
                                    data-moveindex={black.index}
                                    className={`${styles.blackMove} ${black.isHighlighted ? styles.highlighted : ''}`}
                                    onClick={() => goToPosition(black.index)}
                                    aria-label={`black full move ${moveNumber} ${black.move}`}
                                >
                                    {black.move}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
