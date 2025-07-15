import { useEffect, useLayoutEffect, useRef } from 'react';
import styles from './editor.module.css';

type MoveListProps = { moveString: string; highlightedMoveIndex: number };

export function MoveList({ moveString, highlightedMoveIndex }: MoveListProps) {
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

    function autoFocusIfHighlighted(
        isHighlighted: boolean
    ): (el: HTMLElement | null) => void {
        return (element: HTMLElement | null) => {
            if (element && isHighlighted) {
                element.autofocus = true;
            }
        };
    }

    return (
        <ol className={styles.moveList} aria-label="moves" ref={moveListRef}>
            {moves.map((fullMove) => {
                const [moveNumber, firstMove, secondMove] = fullMove.split(' ');
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
                    <li key={moveNumber} className={styles.fullMove}>
                        {moveNumber}
                        {white.move && (
                            <button
                                data-moveindex={white.index}
                                className={`${styles.whiteMove} ${white.isHighlighted ? styles.highlighted : ''}`}
                                // do not use autoFocus https://github.com/facebook/react/issues/23301
                                ref={autoFocusIfHighlighted(
                                    white.isHighlighted
                                )}
                            >
                                {white.move}
                            </button>
                        )}
                        {black.move && (
                            <button
                                data-moveindex={black.index}
                                className={`${styles.blackMove} ${black.isHighlighted ? styles.highlighted : ''}`}
                                ref={autoFocusIfHighlighted(
                                    black.isHighlighted
                                )}
                            >
                                {black.move}
                            </button>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
