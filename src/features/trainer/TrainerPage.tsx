import { Link, useOutletContext } from 'react-router';
import { Trainer } from './components/Trainer';
import { useShuffledLines } from '@/hooks/useShuffledLines';
import type { OutletContext } from '@/types/utility';
import type { TestLine } from '@/types/repertoire';
import styles from './page.module.css';

export function TrainerPage() {
    document.title = 'Chesslines | Trainer';

    const { repertoire, lineIDsToTrain } = useOutletContext<OutletContext>();
    const linesToTrain: TestLine[] = lineIDsToTrain
        // if storage contains stale IDs, don't crash. Just strip them out
        .filter((id) => Object.keys(repertoire.lines).includes(id))
        .map((id) => [id, repertoire.lines[id]]);

    const { currentLine, toNextLine, progress } =
        useShuffledLines(linesToTrain);

    return (
        <main
            className={`${styles.main} ${linesToTrain.length === 0 ? styles.noLines : ''}`}
        >
            {linesToTrain.length ? (
                <Trainer
                    key={progress}
                    progress={progress}
                    linesToTrain={linesToTrain}
                    testLine={currentLine}
                    toNextLine={toNextLine}
                />
            ) : (
                <>
                    <p>No lines to train!</p>
                    <Link to="/repertoire">
                        Set lines to train from your repertoire
                    </Link>
                </>
            )}
        </main>
    );
}
