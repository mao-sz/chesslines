import styles from './lines.module.css';

type MoveListProps = { moveString: string; highlightedMoveIndex: number };

export function MoveList({ moveString, highlightedMoveIndex }: MoveListProps) {
    // https://regexr.com/8g0go to test this regex
    const moves = moveString.split(/\s(?=\d)/);
    let moveIndex = 0;

    return (
        <ol>
            {moves.map((fullMove) => {
                const [moveNumber, firstMove, secondMove] = fullMove.split(' ');
                const white = {
                    move: secondMove ? firstMove : null,
                    index: moveIndex,
                    isHighlighted: moveIndex === highlightedMoveIndex,
                };
                moveIndex++;
                const black = {
                    move: secondMove ?? firstMove,
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
