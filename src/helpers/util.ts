export function expandEmptySquares(FENRow: string): string[] {
    const chars = FENRow.split('');
    return chars
        .map((char) => (Number(char) ? Array(Number(char)).fill(null) : char))
        .flat();
}
