import {
    type MouseEvent,
    type PointerEvent as ReactPointerEvent,
    useEffect,
    useState,
} from 'react';
import { Square } from './Square';
import {
    expandEmptySquares,
    isPawnPromoting,
    isSameColour,
    reverse,
} from '@/util/util';
import type { StateSetter } from '@/types/utility';
import type { Colour, MoveInfo } from '@/types/chessboard';
import styles from './chessboard.module.css';
import { PromotionOptions } from './PromotionOptions';

type ChessboardProps = {
    boardSizeClass?: string;
    position: string;
    playerColour: Colour;
    orientation: Colour;
    playMove: (move: MoveInfo) => void;
    setShouldShowFeedback?: StateSetter<boolean>;
};

const RANK = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = 'abcdefgh';

export function Chessboard({
    boardSizeClass = styles.boardSize,
    position,
    playerColour,
    orientation,
    playMove,
    setShouldShowFeedback,
}: ChessboardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [promotionOptions, setPromotionOptions] = useState<string | null>(
        null
    );

    const displayPosition = orientation === 'w' ? position : reverse(position);

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
        const RIGHT_CLICK = 2;
        if (
            square.tagName !== 'BUTTON' ||
            e.button === RIGHT_CLICK ||
            promotionOptions !== null
        ) {
            return;
        }

        const { rank, file, contains } = square.dataset;

        // clicking empty square but not moving piece
        if (!selectedSquare && !contains) {
            setShouldShowFeedback?.(false);
            return;
        }

        const isOwnPiece = isSameColour(playerColour, contains);
        const isSamePiece = `${file}${rank}` == selectedSquare;

        if (isPawnPromoting(selectedPiece, Number(rank))) {
            setPromotionOptions(`${file}${rank}`);
            return;
        }

        if (selectedSquare && !isOwnPiece && !isSamePiece) {
            play({ from: selectedSquare, to: `${file}${rank}` });
            return;
        }

        setSelectedSquare(isOwnPiece && !isSamePiece ? `${file}${rank}` : null);
        setSelectedPiece(isOwnPiece && !isSamePiece ? contains! : null);
        setShouldShowFeedback?.(false);
    }

    function clearMove(e: MouseEvent): void {
        e.preventDefault();
        setSelectedSquare(null);
        setSelectedPiece(null);
        setPromotionOptions(null);
        setShouldShowFeedback?.(false);
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
        if (!isReleaseFromDrag || promotionOptions !== null) {
            return;
        }

        if (isPawnPromoting(selectedPiece, Number(rank))) {
            setPromotionOptions(`${file}${rank}`);
        } else if (selectedSquare && !isOwnPiece) {
            play({ from: selectedSquare, to: `${file}${rank}` });
        }
    }

    function play(move: MoveInfo): void {
        playMove(move);
        setSelectedSquare(null);
        setSelectedPiece(null);
        setPromotionOptions(null);
        setShouldShowFeedback?.(true);
    }

    return (
        <div
            className={`${styles.board} ${boardSizeClass}`}
            onPointerDown={handleSquareClick}
            onPointerUp={handlePointerUp}
            onContextMenu={clearMove}
        >
            {promotionOptions && (
                <PromotionOptions
                    colour={playerColour}
                    from={selectedSquare as string} // cannot be null in this situation
                    to={promotionOptions}
                    closeOptions={clearMove}
                    play={play}
                />
            )}
            {displayPosition
                .split('/')
                .map((row, rank) =>
                    expandEmptySquares(row).map((square, file) => (
                        <Square
                            key={`${file}${rank}`}
                            selectedSquare={selectedSquare}
                            player={playerColour}
                            contains={square}
                            rank={orientation === 'w' ? RANK[rank] : rank + 1}
                            file={
                                orientation === 'w'
                                    ? FILE[file]
                                    : reverse(FILE)[file]
                            }
                        />
                    ))
                )}
        </div>
    );
}
