type PieceProps = { piece: string | null };

const pieceNames: { [key: string]: string } = {
    P: 'pawn',
    R: 'rook',
    N: 'knight',
    B: 'bishop',
    Q: 'queen',
    K: 'king',
};

export function Piece({ piece }: PieceProps) {
    const pieceImageFile = new URL(
        `/src/assets/pieces/${piece}.svg`,
        import.meta.url
    ).href;

    const colour = piece === piece?.toUpperCase() ? 'white' : 'black';

    return (
        piece && (
            <img
                src={pieceImageFile}
                alt={`${colour} ${pieceNames[piece.toUpperCase()]}`}
            />
        )
    );
}
