type PieceProps = { piece: string | null };

export function Piece({ piece }: PieceProps) {
    const pieceImageFile = new URL(
        `../assets/pieces/${piece}.svg`,
        import.meta.url
    ).href;

    return piece && <img src={pieceImageFile} />;
}
