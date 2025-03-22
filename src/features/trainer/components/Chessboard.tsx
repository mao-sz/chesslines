import {
    type MouseEvent,
    type PointerEvent as ReactPointerEvent,
    useEffect,
    useState,
} from 'react';
import { Square } from './Square';
import { expandEmptySquares, isSameColour, reverse } from '@/util/util';
import type { StateSetter } from '@/types/utility';
import type { Colour, MoveInfo } from '@/types/chessboard';
import styles from './chessboard.module.css';

type ChessboardProps = {
    position: string;
    playerColour: Colour;
    playMove: (move: MoveInfo) => void;
    setShouldShowFeedback: StateSetter<boolean>;
};

const RANK = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = 'abcdefgh';

export function Chessboard({
    position,
    playerColour,
    playMove,
    setShouldShowFeedback,
}: ChessboardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const displayPosition = playerColour === 'w' ? position : reverse(position);

    // Clear selectedSquare if dragged and dropped outside of the board
    useEffect(() => {
        function clearSelectedSquare(e: PointerEvent) {
            const target = e.target as HTMLElement;
            if (!target.className.includes(styles.square)) {
                setSelectedSquare(null);
            }
        }
        window.addEventListener('pointerup', clearSelectedSquare);
        return () =>
            window.removeEventListener('pointerup', clearSelectedSquare);
    }, []);

    function handleSquareClick(e: ReactPointerEvent): void {
        const square = e.target as HTMLElement;
        if (square.tagName !== 'BUTTON') {
            return;
        }

        const { rank, file, contains } = square.dataset;

        // clicking empty square but not moving piece
        if (!selectedSquare && !contains) {
            setShouldShowFeedback(false);
            return;
        }

        const isOwnPiece = isSameColour(playerColour, contains);
        const isSamePiece = `${file}${rank}` == selectedSquare;

        if (selectedSquare && !isOwnPiece && !isSamePiece) {
            playMove({ from: selectedSquare, to: `${file}${rank}` });
            setSelectedSquare(null);
            setShouldShowFeedback(true);
            return;
        }

        setSelectedSquare(isOwnPiece && !isSamePiece ? `${file}${rank}` : null);
        setShouldShowFeedback(false);
    }

    function clearMove(e: MouseEvent): void {
        e.preventDefault();
        setSelectedSquare(null);
        setShouldShowFeedback(false);
    }

    function handlePointerUp(e: ReactPointerEvent) {
        const square = e.target as HTMLButtonElement;
        const { rank, file, contains } = square.dataset;
        const isOwnPiece = isSameColour(playerColour, contains);
        const isSamePiece = `${file}${rank}` === selectedSquare;
        const isLeftMouseButton = e.button === 0;
        const isReleaseFromDrag = isLeftMouseButton && !isSamePiece;

        // Clicking on a square is handled in `handleSquareClick`
        // This should only be for actual dragging onto different square
        if (!isReleaseFromDrag) {
            return;
        }

        if (selectedSquare && !isOwnPiece) {
            playMove({ from: selectedSquare, to: `${file}${rank}` });
            setSelectedSquare(null);
            setShouldShowFeedback(true);
            return;
        }
    }

    return (
        <div
            className={styles.board}
            onPointerDown={handleSquareClick}
            onPointerUp={handlePointerUp}
            onContextMenu={clearMove}
        >
            {displayPosition
                .split('/')
                .map((row, rank) =>
                    expandEmptySquares(row).map((square, file) => (
                        <Square
                            key={`${file}${rank}`}
                            selectedSquare={selectedSquare}
                            player={playerColour}
                            contains={square}
                            rank={playerColour === 'w' ? RANK[rank] : rank + 1}
                            file={
                                playerColour === 'w'
                                    ? FILE[file]
                                    : reverse(FILE)[file]
                            }
                        />
                    ))
                )}
        </div>
    );
}
