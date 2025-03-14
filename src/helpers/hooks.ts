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
    const startingFEN = comparison.current.toFEN();

    const userBoard = useRef(new Chess(startingFEN));

    const [success, setSuccess] = useState(true);
    const [position, setPosition] = useState(getPosition(startingFEN));

    function playMove(move: MoveInfo): void {
        const [error] = userBoard.current.playMove(move);
        if (error) {
            return;
        }

        comparison.current.toNextPosition();

        const currentFEN = userBoard.current.toFEN();
        const correctMove = currentFEN === comparison.current.toFEN();

        // TODO: Play opponent move after correct move
        if (correctMove) {
            setPosition(getPosition(currentFEN));
            setSuccess(true);
        } else {
            comparison.current.toPreviousPosition();
            userBoard.current.toPreviousPosition();
            setSuccess(false);
        }
    }

    return { position, success, playMove };
}
