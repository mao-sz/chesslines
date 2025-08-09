import { Chess } from '@maoshizhong/chess';
import { useRef, useState } from 'react';
import {
    constructFullPGN,
    getMoves,
    getPosition,
    toPieceName,
} from '@/util/util';
import type { MoveInfo } from '@/types/chessboard';
import type { RepertoireLine } from '@/types/repertoire';

export function useTrainerChessboard({
    startingFEN,
    PGN: PGNMoves,
    player,
}: RepertoireLine) {
    const isNewChess = useRef(true);
    const comparison = useRef(
        new Chess(constructFullPGN(startingFEN, PGNMoves), { isPGN: true })
    );
    const finalPosition = useRef(comparison.current.toFEN());

    // Set the comparison board to first userBoard's position - only want to run on component mount, not every call
    // useEffect not suitable here as this must occur before creating the user chessboard
    if (isNewChess.current) {
        // https://regexr.com/8gfbm to test this regex
        const blackStartRegex = /^\d+\.{3}\s/;
        const firstRecordedMoveColour = blackStartRegex.test(PGNMoves)
            ? 'b'
            : 'w';
        comparison.current.toNthPosition(
            player === firstRecordedMoveColour ? 0 : 1
        );
        isNewChess.current = false;
    }

    const [lineSuccess, setLineSuccess] = useState(false);
    const [moveSuccess, setMoveSuccess] = useState(true);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(
        comparison.current.activePlayer.colour === 'w' ? 1 : 2
    );
    const [position, setPosition] = useState(
        getPosition(comparison.current.toFEN())
    );

    function playMove(move: MoveInfo): void {
        // no more to play!
        if (lineSuccess) {
            return;
        }

        const userBoard = new Chess(comparison.current.toFEN());
        const [error] = userBoard.playMove(move);
        if (error) {
            return;
        }

        const correctMove =
            userBoard.toFEN() === comparison.current.toNextPosition().toFEN();

        if (correctMove) {
            // then play opponent move
            setPosition(
                getPosition(comparison.current.toNextPosition().toFEN())
            );
            setMoveSuccess(true);
            // +2 to skip over opponent's move
            setCurrentMoveIndex(currentMoveIndex + 2);
        } else {
            comparison.current.toPreviousPosition();
            setMoveSuccess(false);
        }

        setLineSuccess(comparison.current.toFEN() === finalPosition.current);
    }

    function getLegalMoves(square: string): string[] {
        return comparison.current.getLegalMoves(square);
    }

    return {
        position,
        currentMoveIndex,
        playMove,
        getLegalMoves,
        hint: toPieceName(
            getMoves(comparison.current.toPGN())[currentMoveIndex - 1]
        ),
        moveSuccess,
        lineSuccess,
    };
}
