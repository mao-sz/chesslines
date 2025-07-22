import { useOutletContext } from 'react-router';
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

    return (
        <main className={styles.main}>
            <Trainer
                key={progress}
                progress={progress}
                linesToTrain={linesToTrain}
                testLine={currentLine}
                toNextLine={toNextLine}
            />
        </main>
    );
}
