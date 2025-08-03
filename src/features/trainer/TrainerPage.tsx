import { Link, useOutletContext } from 'react-router';
import { Trainer } from './components/Trainer';
import { useShuffledLines } from '@/hooks/useShuffledLines';
import type { OutletContext } from '@/types/utility';
import type { TestLine } from '@/types/repertoire';
import styles from './page.module.css';

export function TrainerPage() {
    document.title = 'Chesslines | Trainer';

    // TODO: Implement pre-trainer line select page!
    const { repertoire } = useOutletContext<OutletContext>();
    const linesToTrain: TestLine[] = Object.entries(repertoire.lines);

    const { currentLine, toNextLine, progress } =
        useShuffledLines(linesToTrain);

    const classNames = [styles.main];
    if (!linesToTrain.length) {
        classNames.push(styles.noLines);
    }

    return (
        <main className={classNames.join(' ')}>
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
