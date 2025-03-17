export function reverse(str: string): string {
    return str.split('').reverse().join('');
}

// Fisher-Yates shuffle to reduce less permutation bias
export function toShuffled<T>(arr: T[]): T[] {
    const arrClone = [...arr];
    for (let i = arrClone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrClone[j], arrClone[i]] = [arrClone[i], arrClone[j]];
    }
    return arrClone;
}

export function expandEmptySquares(FENRow: string): string[] {
    const chars = FENRow.split('');
    return chars
        .map((char) => (Number(char) ? Array(Number(char)).fill(null) : char))
        .flat();
}

export function getPosition(FEN: string): string {
    return FEN.split(' ')[0];
}
