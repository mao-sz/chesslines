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
    getLegalMoves: (square: string) => string[];
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
    getLegalMoves,
    setShouldShowFeedback,
}: ChessboardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [promotionOptions, setPromotionOptions] = useState<string | null>(
        null
    );
    const [legalMovesShown, setLegalMovesShown] = useState<string[]>([]);

    const displayPosition = orientation === 'w' ? position : reverse(position);
    const isShowingPromotions = promotionOptions !== null;

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

    function selectSquare(e: ReactPointerEvent): void {
        const square = e.target as HTMLElement;
        const RIGHT_CLICK = 2;
        if (
            square.tagName !== 'BUTTON' ||
            e.button === RIGHT_CLICK ||
            isShowingPromotions
        ) {
            setLegalMovesShown([]);
            return;
        }

        const { rank, file, contains } = square.dataset;
        setShouldShowFeedback?.(false);

        if (contains && isSameColour(playerColour, contains)) {
            setSelectedSquare(`${file}${rank}`);
            setSelectedPiece(contains);
        }
    }

    function releasePiece(e: ReactPointerEvent) {
        const destinationSquare = e.target as HTMLButtonElement;
        const { rank, file, contains } = destinationSquare.dataset;
        const isSamePiece = `${file}${rank}` === selectedSquare;

        if (!selectedSquare || isSamePiece || isShowingPromotions) {
            return;
        }

        const isOwnPiece = isSameColour(playerColour, contains);
        if (isPawnPromoting(selectedPiece, Number(rank))) {
            setPromotionOptions(`${file}${rank}`);
        } else if (!isOwnPiece) {
            play({ from: selectedSquare, to: `${file}${rank}` });
        }
    }

    function play(move: MoveInfo): void {
        playMove(move);
        clearMove();
        setShouldShowFeedback?.(true);
    }

    function clearMove(e?: MouseEvent): void {
        e?.preventDefault();
        setSelectedSquare(null);
        setSelectedPiece(null);
        setPromotionOptions(null);
        setShouldShowFeedback?.(false);
    }

    return (
        <div
            className={`${styles.board} ${boardSizeClass}`}
            onPointerDown={selectSquare}
            onPointerUp={releasePiece}
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
