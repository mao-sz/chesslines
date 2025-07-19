import { useOutletContext } from 'react-router';
import { Trainer } from './components/Trainer';
import { useShuffledLines } from '@/hooks/useShuffledLines';
import type { OutletContext } from '@/types/utility';

export function TrainerPage() {
    document.title = 'Chesslines | Trainer';

    // TODO: Implement pre-trainer line select page!
    const { repertoire } = useOutletContext<OutletContext>();
    const linesToTrain = Object.values(repertoire.lines);

    const { currentLine, toNextLine, progress } =
        useShuffledLines(linesToTrain);
    const hasLinesLeft = progress < linesToTrain.length;

    return (
        <>
            <div>
                {hasLinesLeft && (
                    <button onClick={toNextLine} aria-label="next line">
                        Next
                    </button>
                )}
                <p>
                    Line {progress}/{linesToTrain.length}
                </p>
            </div>

            <Trainer key={progress} line={currentLine} />
        </>
    );
}
