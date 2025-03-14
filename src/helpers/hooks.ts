import { Chess } from '@maoshizhong/chess';
import { useRef, useState } from 'react';
import type { Colour, MoveInfo } from '../types';
import { getPosition } from './util';

export function useChess(PGN: string, playerColour: Colour) {
    const isNewChess = useRef(true);
    const comparison = useRef(new Chess(PGN, { isPGN: true }));

    // Set the comparison board to first userBoarded position - only want to run on component mount, not every call
    // useEffect not suitable here as this must occur before creating the user chessboard
    if (isNewChess.current) {
        comparison.current.toNthPosition(playerColour === 'w' ? 0 : 1);
        isNewChess.current = false;
    }

    const [success, setSuccess] = useState(true);
    const [position, setPosition] = useState(
        getPosition(comparison.current.toFEN())
    );

    function playMove(move: MoveInfo): void {
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
            setSuccess(true);
        } else {
            comparison.current.toPreviousPosition();
            setSuccess(false);
        }
    }

    return { position, playMove, success };
}
