import { useLayoutEffect, useRef, useState } from 'react';
import {
    constructFullPGN,
    extractActiveColour,
    getMoves,
    getPosition,
} from '@/util/util';
import { STANDARD_STARTING_FEN } from '@/util/constants';
import { CaughtChess } from '@/util/caughtChess';
import type { MoveInfo } from '@/types/chessboard';

export function useRepertoireChessboard(pgn?: string, startPosition?: string) {
    if (pgn && startPosition !== STANDARD_STARTING_FEN) {
        pgn = constructFullPGN(startPosition || STANDARD_STARTING_FEN, pgn);
    }

    // clear unnecessary whitespace
    pgn = pgn?.replaceAll(/\s+/g, ' ').trim();
    startPosition = startPosition?.replaceAll(/\s+/g, ' ').trim();

    const chessboard = useRef(
        new CaughtChess(pgn || startPosition, {
            isPGN: typeof pgn === 'string' && pgn.length > 0,
        })
    );

    const [initialisationError, setInitialisationError] = useState(false);
    // Ensure state setting only occurs when editor is opened for the first time, else too many rerenders
    // Normal effect would flash empty chessboard briefly
    useLayoutEffect(() => {
        if (chessboard.current.invalid) {
            setInitialisationError(true);
        }
    }, []);

    const [moveList, setMoveList] = useState(
        getMoves(chessboard.current.toPGN())
    );

    // Not fullmove! Just straight up individual moves (annoying that halfmoves are specifically
    // about non-capture/pawn moves and not just individual moves)
    const [currentMoveIndex, setCurrentMoveIndex] = useState(moveList.length);
    const [activeColour, setActiveColour] = useState(
        extractActiveColour(chessboard.current.toFEN())
    );
    const [startingFEN, setStartingFEN] = useState(
        startPosition || STANDARD_STARTING_FEN
    );

    function loadNewPosition(FEN: string, moves: string): boolean {
        // clear unnecessary whitespace
        FEN = FEN.replaceAll(/\s+/g, ' ').trim();
        moves = moves.replaceAll(/\s+/g, ' ').trim();

        const pgn = constructFullPGN(FEN, moves);
        const newBoard = moves
            ? new CaughtChess(pgn, { isPGN: true })
            : new CaughtChess(FEN);

        // prevent loading invalid board
        if (newBoard.invalid) {
            setInitialisationError(true);
            return false;
        }

        chessboard.current = newBoard;
        const newMoveList = getMoves(chessboard.current.toPGN());

        setStartingFEN(FEN);
        setMoveList(newMoveList);
        setCurrentMoveIndex(newMoveList.length);
        setActiveColour(extractActiveColour(chessboard.current.toFEN()));
        setInitialisationError(false);
        return true;
    }

    function playMove(move: MoveInfo): void {
        const [error] = chessboard.current.playMove(move);
        if (error) {
            return;
        }

        setMoveList(getMoves(chessboard.current.toPGN()));
        setCurrentMoveIndex(currentMoveIndex + 1);
        setActiveColour(activeColour === 'w' ? 'b' : 'w');
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
        setActiveColour(extractActiveColour(chessboard.current.toFEN()));
    }

    function toNextPosition(): void {
        chessboard.current.toNextPosition();
        if (currentMoveIndex < moveList.length) {
            setCurrentMoveIndex(currentMoveIndex + 1);
            setActiveColour(extractActiveColour(chessboard.current.toFEN()));
        }
    }

    function toPreviousPosition(): void {
        chessboard.current.toPreviousPosition();
        if (currentMoveIndex > 0) {
            setCurrentMoveIndex(currentMoveIndex - 1);
            setActiveColour(extractActiveColour(chessboard.current.toFEN()));
        }
    }

    return {
        initialisationError: initialisationError,
        setInitialisationError: setInitialisationError,
        activeColour: activeColour,
        position: {
            current: getPosition(chessboard.current.toFEN()),
            currentIndex: currentMoveIndex,
            toNth: toNthPosition,
            toNext: toNextPosition,
            toPrevious: toPreviousPosition,
        },
        startingFEN: initialisationError ? (startPosition ?? '') : startingFEN,
        moves: {
            list: initialisationError
                ? (pgn ?? '')
                : chessboard.current.toPGN({ movesOnly: true }),
            play: playMove,
        },
        loadNewPosition: loadNewPosition,
    };
}
