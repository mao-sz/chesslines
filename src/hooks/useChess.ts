import { Chess } from '@maoshizhong/chess';
import { useRef, useState } from 'react';
import { getPosition } from '@/util/util';
import type { Line, MoveInfo } from '@/types/types';

export function useChess({ pgn, player }: Line) {
    const isNewChess = useRef(true);
    const comparison = useRef(new Chess(pgn, { isPGN: true }));
    const finalPosition = useRef(comparison.current.toFEN());

    // Set the comparison board to first userBoarded position - only want to run on component mount, not every call
    // useEffect not suitable here as this must occur before creating the user chessboard
    if (isNewChess.current) {
        comparison.current.toNthPosition(player === 'w' ? 0 : 1);
        isNewChess.current = false;
    }

    const [lineSuccess, setLineSuccess] = useState(false);
    const [moveSuccess, setMoveSuccess] = useState(true);
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
        } else {
            comparison.current.toPreviousPosition();
            setMoveSuccess(false);
        }

        setLineSuccess(comparison.current.toFEN() === finalPosition.current);
    }

    return { position, playMove, moveSuccess, lineSuccess };
}
