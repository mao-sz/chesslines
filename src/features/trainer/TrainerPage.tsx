import { useShuffledLines } from '@/hooks/useShuffledLines';
import { Trainer } from './components/Trainer';
import type { Line } from '@/types/chessboard';

type TrainerPageProps = { lines: Line[] };

export function TrainerPage({ lines }: TrainerPageProps) {
    const { currentLine, toNextLine, progress } = useShuffledLines(lines);
    const hasLinesLeft = progress < lines.length;

    return (
        <>
            <div>
                {hasLinesLeft && (
                    <button onClick={toNextLine} aria-label="next line">
                        Next
                    </button>
                )}
                <p>
                    Line {progress}/{lines.length}
                </p>
            </div>

            <Trainer key={progress} line={currentLine} />
        </>
    );
}
