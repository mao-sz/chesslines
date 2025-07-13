import { Chess } from '@maoshizhong/chess';
import { useRef, useState } from 'react';
import { extractActiveColour, getMoves, getPosition } from '@/util/util';
import { STANDARD_STARTING_FEN } from '@/util/constants';
import type { MoveInfo } from '@/types/chessboard';

export function useRepertoireChessboard(pgn?: string, startPosition?: string) {
    if (pgn && startPosition !== STANDARD_STARTING_FEN) {
        pgn = `$[FEN "${startPosition}"]\n\n${pgn}`;
    }
    const chessboard = useRef(
        new Chess(pgn, { isPGN: typeof pgn === 'string' })
    );
    const moveList = getMoves(chessboard.current.toPGN());

    // Not fullmove! Just straight up individual moves (annoying that halfmoves are specifically
    // about non-capture/pawn moves and not just individual moves)
    const [currentMoveNumber, setCurrentMoveIndex] = useState(moveList.length);
    const [activeColour, setActiveColour] = useState(
        extractActiveColour(chessboard.current.toFEN())
    );
    const [startingFEN, setStartingFEN] = useState(
        startPosition || STANDARD_STARTING_FEN
    );

    function playMove(move: MoveInfo): void {
        const isOverwritingMoves = currentMoveNumber < moveList.length;
        if (isOverwritingMoves) {
            // TODO: overwrite moves
            console.log('FIX ME!');
        } else {
            const [error] = chessboard.current.playMove(move);
            if (error) {
                return;
            }

            setCurrentMoveIndex(currentMoveNumber + 1);
            setActiveColour(activeColour === 'w' ? 'b' : 'w');
        }
    }

    function toNthPosition(n: number): void {
        chessboard.current.toNthPosition(n);
        if (n > moveList.length) {
            setCurrentMoveIndex(moveList.length);
        } else if (n > 0) {
            setCurrentMoveIndex(n);
        } else {
            setCurrentMoveIndex(0);
        }
    }

    function toNextPosition(): void {
        chessboard.current.toNextPosition();
        if (currentMoveNumber < moveList.length) {
            setCurrentMoveIndex(currentMoveNumber + 1);
        }
    }

    function toPreviousPosition(): void {
        chessboard.current.toPreviousPosition();
        if (currentMoveNumber > 0) {
            setCurrentMoveIndex(currentMoveNumber - 1);
        }
    }

    return {
        activeColour: activeColour,
        position: {
            current: getPosition(chessboard.current.toFEN()),
            currentIndex: currentMoveNumber,
            toNth: toNthPosition,
            toNext: toNextPosition,
            toPrevious: toPreviousPosition,
        },
        startingFEN: startingFEN,
        currentPGN: chessboard.current.toPGN(),
        moves: {
            list: chessboard.current.toPGN({ movesOnly: true }),
            play: playMove,
        },
    };
}
