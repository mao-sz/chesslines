import { Chess } from '@maoshizhong/chess';
import { useLayoutEffect, useRef, useState } from 'react';
import type { Line, MoveInfo } from '../types';
import { getPosition, toShuffled } from '../util';

export function useShuffledLines(lines: Line[]) {
    const [shuffledLines, setShuffledLines] = useState(toShuffled(lines));
    const [currentLine, setCurrentLine] = useState(shuffledLines[0]);
    return {
        currentLine: currentLine,
        progress: lines.length - shuffledLines.length + 1,
        toNextLine() {
            const remainingLines = shuffledLines.slice(1);
            setShuffledLines(remainingLines);
            setCurrentLine(remainingLines[0]);
        },
    };
}

export function useChess({ pgn, player }: Line, key: number) {
    const isNewChess = useRef(true);
    const comparison = useRef(new Chess(pgn, { isPGN: true }));
    const finalPosition = useRef(comparison.current.toFEN());

    // Set the comparison board to first userBoarded position - only want to run on component mount, not every call
    // useEffect not suitable here as this must occur before creating the user chessboard
    if (isNewChess.current) {
        console.log('initial pos');
        comparison.current.toNthPosition(player === 'w' ? 0 : 1);
        isNewChess.current = false;
    }

    const [lineSuccess, setLineSuccess] = useState(false);
    const [moveSuccess, setMoveSuccess] = useState(true);
    const [position, setPosition] = useState(
        getPosition(comparison.current.toFEN())
    );

    // When key changes (new line), reset everything to initial state.
    // Need to do it manually because calling toNextLine from useShuffledLines
    // isn't enough to trigger a fresh Chess instance.
    // Layout effect used to prevent flash of new line's end position from being painted
    useLayoutEffect(() => {
        comparison.current = new Chess(pgn, { isPGN: true });
        finalPosition.current = comparison.current.toFEN();
        comparison.current.toNthPosition(player === 'w' ? 0 : 1);

        setLineSuccess(false);
        setMoveSuccess(true);
        setPosition(getPosition(comparison.current.toFEN()));
        console.log('key changed');
    }, [key]);

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
