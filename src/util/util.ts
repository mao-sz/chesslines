import type { Colour, PieceName } from '@/types/chessboard';
import type { Repertoire } from '@/types/repertoire';
import { UUID } from '@/types/utility';

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

export function isSameColour(
    player: Colour,
    pieceLetter?: string | null
): boolean {
    if (!pieceLetter) {
        return false;
    }

    return player === 'w'
        ? pieceLetter.toUpperCase() === pieceLetter
        : pieceLetter.toLowerCase() === pieceLetter;
}

export function isPawnPromoting(
    pieceLetter: string | null,
    destinationRank: number
): boolean {
    if (!pieceLetter) {
        return false;
    }

    const isPawn = pieceLetter === 'p' || pieceLetter === 'P';
    const promotionRank = pieceLetter === 'P' ? 8 : 1;

    return isPawn && destinationRank === promotionRank;
}

export function getMoves(pgnMoves: string): string[] {
    // https://regexr.com/8c9j5 to test this regex
    const movesString = pgnMoves.match(/\d+\.+ .+/)?.[0] ?? '';
    return movesString
        ? movesString
              .split(' ')
              .filter((move) => !/\.|1-0|0-1|1\/2-1\/2/.test(move))
              .map((move) =>
                  move.endsWith('#') || move.endsWith('+')
                      ? move.slice(0, -1)
                      : move
              )
        : []; // if movesString is empty, the returned array would end up as ['']
}

export function extractActiveColour(FEN: string): Colour {
    const isWhite = FEN.includes('w');
    return isWhite ? 'w' : 'b';
}

export function constructFullPGN(FEN: string, moves: string): string {
    return `[FEN "${FEN}"]\n\n${moves}`;
}

export const convert = {
    uuidToId(uuid: string): string {
        return `id-${uuid}`;
    },
    idToUuid(id: string): string {
        return id.slice(3);
    },
};

export function toPieceName(move?: string): PieceName | '' {
    // e.g. line completed, no more moves - the "next move" is undefined
    if (!move) {
        return '';
    }

    const firstLetter = move[0];
    switch (firstLetter) {
        case 'R':
            return 'Rook';
        case 'N':
            return 'Knight';
        case 'B':
            return 'Bishop';
        case 'Q':
            return 'Queen';
        case 'K':
            return 'King';
        default:
            return 'Pawn';
    }
}

export function conditionallyPush<T>(
    arr: T[],
    conditionalPushes: [unknown, T][]
): void {
    for (const [condition, item] of conditionalPushes) {
        if (condition) {
            arr.push(item);
        }
    }
}

export function findParentFolder(
    lineID: UUID | null,
    repertoire: Repertoire
): UUID | null {
    if (!lineID) {
        return null;
    }

    for (const [folderID, folder] of Object.entries(repertoire.folders)) {
        if (folder.contains === 'lines' && folder.children.includes(lineID)) {
            return folderID as UUID;
        }
    }
    return null;
}
