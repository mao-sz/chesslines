import { ICONS, STANDARD_STARTING_FEN } from '@/util/constants';
import type { Colour } from '@/types/chessboard';

type LichessAnalysisButtonProps = {
    startingFEN: string;
    moves: string;
    orientation: Colour;
};

export function LichessAnalysisButton({
    startingFEN,
    moves,
    orientation,
}: LichessAnalysisButtonProps) {
    // cleaner URL to omit tag pair if standard starting FEN
    const FENTagPair =
        startingFEN === STANDARD_STARTING_FEN ? '' : `[FEN "${startingFEN}"]`;
    const colourQuery = orientation === 'w' ? '' : '?color=black';
    // Lichess /anaylsis/pgn/ will auto-remove result from URL if present
    const finalPGN = `${FENTagPair}${moves}${colourQuery}`;

    return (
        <a
            className="iconButton lichessLink"
            href={`https://lichess.org/analysis/pgn/${encodeURI(finalPGN)}`}
            aria-label="analyse line in lichess in new tab"
            target="_blank"
            rel="noopener noreferrer"
        >
            Analyse in Lichess <i className={ICONS.NEW_TAB}></i>
        </a>
    );
}
