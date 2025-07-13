import styles from './lines.module.css';

type MoveListProps = { moveString: string; highlightedMoveIndex: number };

export function MoveList({ moveString, highlightedMoveIndex }: MoveListProps) {
    // https://regexr.com/8g0go to test this regex
    const moves = moveString.split(/\s(?=\d)/);
    // maps to game history state (where 0 is the starting position)
    // hence moves are effectively 1-indexed
    let moveIndex = 1;

    return (
        <ol aria-label="moves">
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
                if (black.move) {
                    moveIndex++;
                }

                return (
                    <li key={moveNumber} className={styles.fullMove}>
                        {moveNumber}
                        {white.move && (
                            <button
                                data-moveindex={white.index}
                                className={`${styles.whiteMove} ${white.isHighlighted ? styles.highlighted : ''}`}
                            >
                                {white.move}
                            </button>
                        )}
                        {black.move && (
                            <button
                                data-moveindex={black.index}
                                className={`${styles.blackMove} ${black.isHighlighted ? styles.highlighted : ''}`}
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
