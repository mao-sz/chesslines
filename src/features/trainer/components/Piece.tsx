import type { PixelCoordinates } from '@/types/chessboard';
import styles from './chessboard.module.css';

const pieceNames: { [key: string]: string } = {
    P: 'pawn',
    R: 'rook',
    N: 'knight',
    B: 'bishop',
    Q: 'queen',
    K: 'king',
};

type PieceProps = {
    isBeingDragged: boolean;
    mouseCoords: PixelCoordinates;
    piece: string | null;
};

export function Piece({ isBeingDragged, mouseCoords, piece }: PieceProps) {
    const pieceImageFile = new URL(
        `/src/assets/pieces/${piece}.svg`,
        import.meta.url
    ).href;

    const colour = piece === piece?.toUpperCase() ? 'white' : 'black';

    return (
        piece && (
            <>
                <img
                    src={pieceImageFile}
                    alt={`${colour} ${pieceNames[piece.toUpperCase()]}`}
                    style={
                        isBeingDragged
                            ? {
                                  position: 'fixed',
                                  top: `${mouseCoords.y}px`,
                                  left: `${mouseCoords.x}px`,
                              }
                            : undefined
                    }
                    draggable={false}
                />
                <img
                    className={styles.ghost}
                    src={pieceImageFile}
                    aria-hidden={true}
                    draggable={false}
                />
            </>
        )
    );
}
